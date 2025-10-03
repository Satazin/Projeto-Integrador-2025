import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Auth, onAuthStateChanged } from '@angular/fire/auth'; 
import { getDatabase, ref, onValue, set } from "firebase/database"; 

interface Brinde {
  id: string;
  nome: string;
  pontos: number;
  descricao: string;
  imagem: string;
}

@Component({
  selector: 'app-brindes',
  templateUrl: './brindes.page.html',
  styleUrls: ['./brindes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BrindesPage implements OnInit {
  pontos: number = 0;
  descricaoAtiva: string | null = null;
  private userId: string | null = null;
  private dbRT;

  brindes: Brinde[] = [
    { id: 'chaveiro', nome: 'Chaveiros', pontos: 500, descricao: 'Chaveiros estiloso para manter suas chaves organizadas, com estilo e personalidade.', imagem: 'assets/chaveiro.png' },
    { id: 'meias', nome: 'Meias', pontos: 1000, descricao: 'Meias confortáveis e estilosas representando o que você mais gosta.', imagem: 'assets/meias.png' },
    { id: 'caneca', nome: 'Xícara', pontos: 1500, descricao: 'Pense em você tomando sua bebida favorita nesta xícara com a nossa logo.', imagem: 'assets/caneca.png' },
    { id: 'gato', nome: 'Gatinho da Sorte', pontos: 2000, descricao: 'Gatinho dourado que simboliza sorte e boas energias para a sua vida.', imagem: 'assets/gato.png' },
    { id: 'totoro', nome: 'Totoro', pontos: 2500, descricao: 'Brinde inspirado no personagem Totoro do filme "Meu Amigo Totoro" do Studio Ghibli.', imagem: 'assets/totoro.png' },
    { id: 'bonsai', nome: 'Bonsai', pontos: 4000, descricao: 'Bonsai: uma técnica de plantio em miniatura, mas repleta de beleza, e significado.', imagem: 'assets/bonsai.png' },
  ];

  constructor(
    private alertController: AlertController,
    private auth: Auth 
  ) {
    this.dbRT = getDatabase();
  }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.carregarPontos();
      } else {
        console.error("Usuário não logado. Pontos não podem ser carregados.");
      }
    });
  }
  private carregarPontos() {
    if (!this.userId) return;
    const pontosRef = ref(this.dbRT, `usuarios/${this.userId}/pontos`);
    onValue(pontosRef, (snapshot) => {
      const data = snapshot.val();
      this.pontos = data !== null ? data : 0;
      console.log(`Pontos carregados em tempo real: ${this.pontos}`);
    });
  }

  toggleDescricao(id: string) {
    this.descricaoAtiva = this.descricaoAtiva === id ? null : id;
  }

  async resgatarBrinde(brinde: Brinde) {
    if (!this.userId) {
      console.error("Usuário não autenticado.");
      return;
    }

    if (this.pontos >= brinde.pontos) {

      const alert = await this.alertController.create({
        header: 'Confirmar Resgate',
        message: `Deseja resgatar "${brinde.nome}" por ${brinde.pontos} pontos?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Resgatar',
            handler: async () => {
              const novoSaldo = this.pontos - brinde.pontos;
              await this.atualizarPontos(novoSaldo);
              this.showSuccessAlert(brinde.nome);

            }
          }
        ]
      });

      await alert.present();
    } else {
      this.showInsufficientPointsAlert(brinde.pontos);
    }
  }

  private async atualizarPontos(novoSaldo: number): Promise<void> {
    if (!this.userId) return;
    try {
      const pontosRef = ref(this.dbRT, `usuarios/${this.userId}/pontos`);
      await set(pontosRef, novoSaldo);
      console.log(`Pontos atualizados para: ${novoSaldo}`);
    } catch (error) {
      console.error('Erro ao salvar novo saldo de pontos:', error);
    }
  }

  async showSuccessAlert(nome: string) {
    const alert = await this.alertController.create({
      header: '🎉 Resgate Concluído!',
      message: `Parabéns! Você resgatou um(a) ${nome}. Entraremos em contato para combinar a entrega.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showInsufficientPointsAlert(pontosNecessarios: number) {
    const alert = await this.alertController.create({
      header: 'Pontos Insuficientes',
      message: `Você precisa de mais ${pontosNecessarios - this.pontos} pontos para resgatar este brinde.`,
      buttons: ['OK']
    });
    await alert.present();
  }
}
