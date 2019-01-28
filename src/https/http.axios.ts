import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import * as HttpBase from "./http.models"; 

/*
  https://github.com/axios/axios

  - Request
  url:
  baseURL:
  method: 'get', // default
  headers:
  params:
  data:
  timeout: 1000, // default is `0` (no timeout)
  responseType: 'json', // default // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'

  - Response
    {
      // `data` is the response that was provided by the server
      data: {},

      // `status` is the HTTP status code from the server response
      status: 200,

      // `statusText` is the HTTP status message from the server response
      statusText: 'OK',

      // `headers` the headers that the server responded with
      // All header names are lower cased
      headers: {},

      // `config` is the config that was provided to `axios` for the request
      config: {},

      // `request` is the request that generated this response
      // It is the last ClientRequest instance in node.js (in redirects)
      // and an XMLHttpRequest instance the browser
      request: {}
    }

*/

export default class AxiosHttp {
  constructor() {
      // Axios global custom defaults values
      axios.defaults.timeout = 9999;
      axios.defaults.baseURL = '';
      
      axios.interceptors.request.use((config: any) => {
          return config;
      }, (error: any) => this.logger(error));

      axios.interceptors.response.use((response: any) => {
          return response;
      }, (error: any) => this.logger(error));
  }


  //#region Private

  private async call(options: HttpBase.HttpRequest): Promise<any> {  
    try {

       HttpBase.SetDefaultHeaders(options.headers); 

      const request: AxiosRequestConfig = { 
        headers: options.headers,
        url: options.url,
        method: options.method,
        data: options.method === HttpBase.HttpMethod.POST ? options.body : {},
        params: options.method === HttpBase.HttpMethod.GET ? options.body : {}
      }; 
 
      const response: AxiosResponse<any> = await axios(request); 

      if (response.status !== HttpBase.HttpStatus.OK ) { 
        throw new Error(response.statusText);
      }

      return response;
    } catch (error){ 
      throw error; 
    }
  }

  private logger(error: any) {
    console.group("*** AXIOS ERROR START ***\n\n");
    
    if (error.response) {
        console.warn("- RESPONSE: \nDATA: ", error.response.data);
        console.warn("\nSTATUS: ", error.response.status);
        console.warn("\nHEADERS: ", error.response.headers);
    } 
    
    if(error.request) {
      console.warn("- REQUEST: ", error.request);
    } 
    
    if (error.message) {
      console.warn("- MESSAGE: ",  error.message);
    }

    if (error.config) 
      console.warn("\n- CONFIG: " , error.config);

    console.groupEnd();
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