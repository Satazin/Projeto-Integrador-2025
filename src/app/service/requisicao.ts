import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Requisicao {


  constructor(
    public http:HttpClient
  ) { }

  get(dados:any){
    return this.http.get('/requisicao',{
      params:dados
    });
  }

  post(formData:any){
    const httpOptions:any = {
      headers: new Headers({
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post('/requisicao', formData, httpOptions);
  }
}
