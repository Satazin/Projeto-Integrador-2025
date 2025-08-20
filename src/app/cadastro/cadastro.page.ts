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
import { RouterLink } from '@angular/router';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonInput,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
    IonCard,
      IonCardContent,
    IonCardTitle,
    IonInputPasswordToggle,
    IonButton,
    RouterLink
  ]
})

export class CadastroPage implements OnInit {

public id: number = 0;
public nome: string = '';
public login: string = '';
public email: string = '';
public senha: string = '';
  constructor(
    private rt: RealtimeDatabaseService,
    private ar: ActivatedRoute,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {

  }
  salvar() {
    this.rt.add('/usuario', {
      nome: this.nome,
      login: this.login,
      email: this.email,
      senha: this.senha,
    }, this.id)
    .then(res => {
      console.log('Salvo com sucesso', res);
      this.router.navigate(['/pedidos']);
    })
    .catch(err => {
      console.log('Falhou', err);
    });
  }
  

}