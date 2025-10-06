import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, NavController } from '@ionic/angular'; // Adicionado NavController
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth';
import { EnderecoTransferService } from '../services/endereco-transfer';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class CadastroPage {
  email = '';
  senha = '';
  nome = '';
  telefone = '';

  public endereco: string = '';
  private auth = getAuth(initializeApp(environment.firebaseConfig));

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController, 
    private enderecoTransfer: EnderecoTransferService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (user.email === this.authService.getAdminEmail()) {
          this.router.navigate(['/pedidos-test']);
        } else {
          this.router.navigate(['/pedidos']);
        }
      }
    });
  }

  selecionarEndereco() {
    this.router.navigate(['/localizacao-cadastro']);
  }

  ionViewWillEnter() {
    this.lerEnderecoDoServico();
  }

  private lerEnderecoDoServico() {
    const novoEndereco = this.enderecoTransfer.getEndereco();

    if (novoEndereco) {
      this.endereco = novoEndereco;
    }
  }


  async fazerCadastro() {
    if (!this.email || !this.senha || !this.nome || !this.telefone || !this.endereco) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos e **selecione o endereço no mapa**.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const resultado = await this.authService.cadastrar(this.email, this.senha, this.nome, this.telefone, this.endereco);
      console.log('Usuário cadastrado:', resultado.authUser);
      console.log('Dados salvos no Realtime Database:', resultado.realtimeData);

      this.router.navigate(['/pedidos']);
    } catch (erro: any) {
      const alert = await this.alertController.create({
        header: 'Falha ao Cadastrar',
        message: 'Ocorreu um erro: ' + erro.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}