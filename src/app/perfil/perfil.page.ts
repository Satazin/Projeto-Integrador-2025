import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  usuarioLogado = true; // Troque para false para testar o estado não logado
  usuario = {
    nome: 'João da Silva',
    email: 'joao@email.com',
    telefone: '(99) 99999-9999',
    endereco: 'Rua das Flores, 123',
    pontos: 120
  };

  constructor() { }

  ngOnInit() {
  }

  logout() {
    this.usuarioLogado = false;
    // Aqui você pode limpar o token, chamar serviço, etc.
  }
}
