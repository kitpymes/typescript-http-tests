import * as HttpBase from "./http.models";

/*
  https://xhr.spec.whatwg.org/

*/

export default class HttpXml implements HttpBase.IHttp{
  constructor() {  }

  //#region Private
     
  private async call(request: HttpBase.HttpRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open(request.method, request.url, true);

      HttpBase.SetDefaultHeaders(request.headers);

      request.headers.forEach((item: {name: string, value: string}) => {
        xhr.setRequestHeader(item.name, item.value);
      })
      
      xhr.onload = () => {
        if(xhr.readyState === 4 && xhr.status === HttpBase.HttpStatus.OK){
          resolve(xhr);  
        }
      }
      
      xhr.onerror = () => {
        reject(new TypeError(xhr.responseText || 'Network request failed'))
      }

      xhr.ontimeout = () => {
        reject(new TypeError(xhr.responseText || 'Network request failed'))
      }      

      xhr.send(request.body);
    });
  }

  //#endregion

  //#region GET

  async get(
    url: string, 
    params?: string | URLSearchParams, 
    headers: HttpBase.HttpHeaders = [{  
      name: "Content-Type",   
      value: HttpBase.HttpContentType.JSON 
    }]): Promise<any> {

    const request: HttpBase.HttpRequest = { 
      url: url,
      method: HttpBase.HttpMethod.GET,  
      body: params, 
      headers: headers
    };

    return await this.call(request); 
  }

  //#endregion

  //#region POST

  async post(
    url: string, 
    data: any = {}, 
    headers: HttpBase.HttpHeaders = [{  
      name: "Content-Type",   
      value: HttpBase.HttpContentType.FORM 
    }]): Promise<any> {

    const request: HttpBase.HttpRequest = {
      url: url,
      method: HttpBase.HttpMethod.POST,
      body: data,
      headers: headers 
    };

    return await this.call(request);
  }

  //#endregion
}