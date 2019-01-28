import * as HttpBase from "./http.models";  
import Xml from "./http.xml"; 
import Fetch from "./http.fetch"; 
import Jquery from "./http.jquery"; 
import Axios from "./http.axios"; 
import LocalMemory from "./local.memory";  

export default class Http{
  corsUrl = 'https://cors-anywhere.herokuapp.com/';
  url: string = this.corsUrl + "https://restcountries.eu/rest/v2/all";

  constructor() {
    this.initXml();
    this.initFetch();
    this.initJquery();
    this.initAxios();
    this.initLocal();
  }

  async initXml() {
    try{
      const xml: Xml = new Xml(); 
      const start: number = window.performance.now();
      const response: any = await xml.get(this.url);
      const end = window.performance.now(), time = end - start;
      const contentType = response.getResponseHeader("Content-Type");
      if(contentType.includes(HttpBase.HttpContentType.JSON)) {
        const result = response.responseText;
        this.showResult("XML", result, time);
      }
    }catch(error){
      console.error(error)
    }
  }

  async initFetch() {
    try{
      const fetch: Fetch = new Fetch();  
      const start: number = window.performance.now();
      const response: any = await fetch.get(this.url);
      const end = window.performance.now(), time = end - start;
      const contentType = response.headers.get("content-type");
      if(contentType.includes(HttpBase.HttpContentType.JSON)) {
        response.text().then((result: string) => {
          this.showResult("FETCH", result, time);
        })
      }
    }catch(error){
      console.error(error)
    }
  }

  async  initJquery() {
    try{
      const jquery: Jquery = new Jquery();  
      const start: number = window.performance.now();
      const response: any = await jquery.get(this.url);
      const end = window.performance.now(), time = end - start;
      if(response.contentType.includes(HttpBase.HttpContentType.JSON)) {
        const result = JSON.stringify(response);
        this.showResult("JQUERY", result, time); 
      }
    }catch(error){
      console.error(error)
    }
  }

  async initAxios() {
    try{
      const axios:Axios = new Axios();  
      const start: number = window.performance.now();
      const response: any = await axios.get(this.url);
      const end = window.performance.now(), time = end - start;
      const contentType = response.headers["content-type"];
      if(contentType && contentType.includes(HttpBase.HttpContentType.JSON)) {
        const result = JSON.stringify(response);
        this.showResult("AXIOS", result, time); 
      }
    }catch(error){
      console.error(error)
    }
  }

  async initLocal() { 
    try{
      let data;
      const xml: Xml = new Xml(); 
      const response: any = await xml.get(this.url);
      const contentType = response.getResponseHeader("Content-Type");
      if(contentType.includes(HttpBase.HttpContentType.JSON)) {
        data = response.responseText;

      const local: LocalMemory = new LocalMemory(data); 
      const start: number = window.performance.now();
      const result: any = await local.get();
      const end = window.performance.now(), time = end - start;
      this.showResult("LOCAL", result, time);
      }
    }catch(error){
      console.error(error)
    }
  }

  showResult(name: string, result: any, time: number){
    const textarea = document.createElement("TEXTAREA");  
    textarea.innerHTML = result;
    textarea.style.width = "500px";
    
    const h2: HTMLElement = document.createElement("h4");
    h2.innerHTML = name + " => timer: " + time.toString().split(".")[0];
	
	document.body.appendChild(h2);
	document.body.appendChild(textarea);
  }
}