import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonImg, IonButton, IonCard } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Autenticacao } from '../service/autenticacao';
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  public email: string = '';
  public senha: string = '';

  constructor(
    public Autenticacao_Service: Autenticacao,
  ) { }

  ngOnInit() {
  }
  login() {
    let email = this.email;
    let senha = this.senha;

    this.Autenticacao_Service
      .login(email, senha)
      .subscribe(
        (_res: any) => {
          if (_res.status == 'success') {
            sessionStorage.setItem('token', _res.token);
          } else {

          }
        }
      );
  }
}
