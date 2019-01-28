import * as HttpBase from "./http.models"; 

/*

  https://github.github.io/fetch

  Options:
    method (String) - HTTP request method. Default: "GET"
    body (String, body types) - HTTP request body
    headers (Object, Headers) - Default: {}
    credentials (String) - Authentication credentials mode. Default: "omit"
      "omit" - don't include authentication credentials (e.g. cookies) in the request
      "same-origin" - include credentials in requests to the same site
      "include" - include credentials in requests to all sites

*/

export default class HttpFetch implements HttpBase.IHttp{       
  constructor(){ } 

  //#region Private

  private checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error:any = new Error(response.statusText)
      error.response = response
      throw error;
    }
  }

  private async call(options: HttpBase.HttpRequest): Promise<any> {  
    try {

      HttpBase.SetDefaultHeaders(options.headers); 

      const request = new Request(options.url, { 
        method: options.method,
        body: options.body
      }); 

      options.headers.forEach((item: {name: string, value: string}) => {  
        if(!request.headers.get(item.name))
            request.headers.set(item.name, item.value);
        } 
      )

      return this.checkStatus(await fetch(request));  
    } catch (error){ 
      throw error; 
    }
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
    body?: HttpBase.HttpBody, 
    headers: HttpBase.HttpHeaders = [{  
      name: "Content-Type",   
      value: HttpBase.HttpContentType.FORM 
    }]): Promise<any> {

    const request: HttpBase.HttpRequest = { 
      url: url,
      method: HttpBase.HttpMethod.POST,  
      body: body, 
      headers: headers
    };

    return await this.call(request);
  }

  //#endregion
}