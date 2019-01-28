export default class LocalMemory {
  private _data: any;
  private _dataSession: any;

  constructor(data: any) { 
    this._data = data;
    
    if(!this._dataSession)
      this._dataSession = this._data; 
  }

  //#region GET

  async get(predicate?: this): Promise<any> { 
    try {
      if(predicate)
        return await JSON.parse(this._dataSession.find(predicate));

      return await this._dataSession;
    } catch (error){
      throw error; 
    }
  }

  //#endregion

  //#region POST

  async post(item: any): Promise<void> {
    try {
      await this._dataSession.push(item);
    } catch (error){
      throw error; 
    }
  }
   
  //#endregion

  //#region PUT

  async put(id: string | number, item: any): Promise<void> {
    try {
      const index = this._dataSession.findIndex(x => x.id === id);
      if (index !== -1) {
        await this._dataSession.splice(index, 1, item);
      }
    } catch (error){
      throw error; 
    }
  }

  //#endregion

  //#region DELETE

  async delete(id: string | number): Promise<void> {
    try {
      const index = this._dataSession.findIndex(x => x.id === id);
      if (index !== -1) {
        await this._dataSession.splice(index, 1);
      }
    } catch (error){
      throw error; 
    }
  }

  //#endregion
}