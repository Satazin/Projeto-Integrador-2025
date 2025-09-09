import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pontos-teste',
  templateUrl: './pontos-teste.page.html',
  styleUrls: ['./pontos-teste.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PontosTestePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
