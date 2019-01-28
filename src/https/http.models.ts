export type HttpHeaders = {
  name: string, 
  value: string}[];

export type HttpBody = string | Blob | ArrayBuffer | FormData | URLSearchParams;

export type HttpRequest = { 
  headers: HttpHeaders
  url: string, 
  method: HttpMethod,
  body?: HttpBody ,
};

export enum HttpMethod { GET = "get", POST = "post", PUT = "put" }
export enum HttpStatus { OK = 200, BADREQUEST = 400, INTERNALSERVERERROR = 500 }
export enum HttpContentType {
    TEXT = "text/plain",
    HTML = "text/html",
    JSON = "application/json",
    SCRIPT = "application/javascript",
    XML = "application/xml",
    FORM = "application/x-www-form-urlencoded"
}

export type HttpGet = (
  url: string, 
  params?: string | URLSearchParams, 
  headers?: HttpHeaders) => Promise<any>;

export type HttpPost = (
  url: string, 
  body?: HttpBody, 
  headers?: HttpHeaders) => Promise<any>;

export interface IHttp {
    get: HttpGet; 
    post: HttpPost; 
}

const HttpHeadersDefault: HttpHeaders = [
{  
  name: "Strict-Transport-Security",   
  value: "max-age=31536000; includeSubDomains" 
},
{
  name: "X-Frame-Options",
  value: "SAMEORIGIN"
},
{
  name: "X-Content-Type-Options",
  value: "nosniff"
},
{
  name: "Content-Security-Policy",
  value: "default-src htpps:"
},
{
  name: "Referrer-Policy",
  value: "strict-origin"
},
{
  name: "Feature-Policy",
  value: "geolocation 'none'; midi 'none'; notifications 'none'; push 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; vibrate 'none'; fullscreen 'none'; payment 'none'"
}

]

export const SetDefaultHeaders = (headers: HttpHeaders): void => {
  HttpHeadersDefault.forEach((item) => {  
    if(headers.findIndex(x=> x.name === item.name) === -1)
        headers.push({name: item.name, value: item.value});
    }
  )
}


