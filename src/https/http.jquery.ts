import Jquery, * as $ from "jquery";
import * as HttpBase from "./http.models";

/*
  https://api.jquery.com/jquery.ajax/#jQuery-ajax-settings

  - jQuery.ajax( [settings ] )
  settings : PlainObject =>
    method (default: 'GET') : String
    contentType (default: 'application/x-www-form-urlencoded; charset=UTF-8') : Boolean or String
    data : PlainObject or String or Array
    dataType (default: Intelligent Guess (xml, json, script, or html)) : String
    headers (default: {}) : PlainObject
    async (default: true) : Boolean
    cache (default: true, false for dataType 'script' and 'jsonp'): Boolean
    crossDomain (default: false for same-domain requests, true for cross-domain requests) : Boolean
    jsonp : String or Boolean
    jsonpCallback : String or Function()

*/

export default class HttpJquery implements HttpBase.IHttp{
  constructor() {
      $.ajaxSetup({
          error: function(jqXHR, textStatus, errorThrown) {
            var msg = "";

            if (jqXHR.status === 0) {
                msg = 'Not connect: Verify Network.';
            } else if (jqXHR.status === 404) {
                msg = 'Requested page not found [404]';
            } else if (jqXHR.status === 500) {
                msg = 'Internal Server Error [500].';
            } else if (textStatus === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (textStatus === 'timeout') {
                msg = 'Time out error.';
            } else if (textStatus === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error: ' + jqXHR.responseText;
            }

            throw new Error(`Ajax Error: ${msg || errorThrown}\n${jqXHR.responseText || ""}`);
          },
          beforeSend: function() {
              //Loading.show();
          },
          complete: function() {
              //Loading.hide();
          }
      });
  }

  //#region Private

  private async call(options: HttpBase.HttpRequest): Promise<any> {  
    try {

      HttpBase.SetDefaultHeaders(options.headers); 

      const request: JQueryAjaxSettings = {
        url: options.url, 
        method: options.method,
        data: options.body,
        beforeSend: function(request) {
          options.headers.forEach((item: {name: string, value: string}) => { 
            request.setRequestHeader(item.name, item.value);
          })
        },
      }; 

      const response = await $.ajax(request)
      .done((response: any, status: JQuery.Ajax.SuccessTextStatus, xhr: JQuery.jqXHR<any>) => {
        
        if(xhr.status === HttpBase.HttpStatus.OK){
          const contentType = xhr.getResponseHeader("Content-Type"); 
          response.contentType = contentType;
          return response;
        }
      })

      return response;
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