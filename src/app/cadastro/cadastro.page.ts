import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonInput,
  IonInputPasswordToggle,
  IonButton,
} from '@ionic/angular/standalone';
import { Requisicao } from '../service/requisicao';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonInputPasswordToggle,
    IonButton,
  ]
})

export class CadastroPage implements OnInit {
  public login: string = "";
  public nome: string = "";
  public email: string = "";
  public senha: string = "";

  constructor(
    public rs: Requisicao
  ) { }

  ngOnInit() {

  }

  post() {
    const fd = new FormData();
    fd.append('controller', 'cadastro-usuario');
    fd.append('nome', this.nome);
    fd.append('login', this.login);
    fd.append('email', this.email);
    fd.append('senha', this.senha);

    this.rs.post(fd)
      .subscribe();
  }
}