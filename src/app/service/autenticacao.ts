import { Injectable } from '@angular/core';
import { Requisicao } from './requisicao';
@Injectable({
  providedIn: 'root'
})
export class Autenticacao {

  constructor(
    public rs: Requisicao,
  ) { }

  login(email: string, senha: string) {
    const fd = new FormData();
    fd.append('controller', 'logar');
    fd.append('email', email);
    fd.append('senha', senha);

    return this.rs
    .post(fd);
  }
  validarToken(_token: string){
    const fd = new FormData();
    fd.append('controller', 'validar-token');
    fd.append('token', _token);

    return this.rs.post(fd);
  }
}
