import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonSelect,
  IonSelectOption,
  ActionSheetController,
  AlertController, IonIcon } from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-pedidos-test',
  templateUrl: './pedidos-test.page.html',
  styleUrls: ['./pedidos-test.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonInput, IonButton, IonItem, IonSelect, IonSelectOption, RouterLink
  ]
})
export class PedidosTestPage implements OnInit {
  public nome: string = '';
  public descricao: string = '';
  public serve: number = 1;
  public preco: number = 0;
  public categoria: string = '';
  public imagem: string = '';
  public pedidos: any[] = [];

  // Categorias fixas
  public categorias = [
    { id: 1, slug: 'poke', nome: 'POKE' },
    { id: 2, slug: 'temaki', nome: 'TEMAKI' },
    { id: 3, slug: 'yakisoba', nome: 'YAKISOBA' },
    { id: 4, slug: 'sushi', nome: 'SUSHI' },
    { id: 5, slug: 'niguiris', nome: 'NIGUIRIS' },
    { id: 6, slug: 'hot', nome: 'PORÇÕES HOT' },
    { id: 7, slug: 'urumakis', nome: 'URUMAKIS' },
    { id: 8, slug: 'acompanhamentos', nome: 'ACOMPANHAMENTOS' },
    { id: 10, slug: 'bebidas', nome: 'BEBIDAS' },
    { id: 11, slug: 'sobremesas', nome: 'SOBREMESAS' }
  ];
  

  constructor(
    private rt: RealtimeDatabaseService,
    private ar: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ){
    this.ar.params.subscribe((param: any) => {
    });
  }

  ngOnInit() {
  }

  async salvar() {
    if (!this.nome || !this.categoria || !this.preco) {
      const a = await this.alertCtrl.create({
        header: 'Campos obrigatórios',
        message: 'Preencha pelo menos nome, categoria e preço.',
        buttons: ['OK']
      });
      await a.present();
      return;
    }

    try {
      await this.rt.add('pedidos', {
        nome: this.nome,
        descricao: this.descricao,
        serve: this.serve,
        preco: this.preco,
        categoria: this.categoria,
        imagem: this.imagem
      });

      console.log('Salvo com sucesso');
      this.listar();

      const alert = await this.alertCtrl.create({
        header: 'Produto cadastrado!',
        message: 'Deseja cadastrar outro ou ir para a lista de pedidos?',
        buttons: [
          {
            text: 'Cadastrar outro',
            role: 'cancel',
            handler: () => {
              this.limparFormulario();
            }
          },
          {
            text: 'Ir para pedidos',
            handler: () => {
              this.router.navigate(['/pedidos']);
            }
          }
        ]
      });

      await alert.present();

    } catch (err) {
      console.error('Falhou', err);
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Não foi possível cadastrar o produto. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  listar(){
    this.rt.query('/pedidos', (snapshot: any) => {
      const dados = snapshot.val();
      if (dados) {
        this.pedidos = Object.keys(dados).map(key => ({
          id: key,
          ...dados[key]
        }));
      } else {
        this.pedidos = [];
      }
    });
  }

  limparFormulario() {
    this.nome = '';
    this.descricao = '';
    this.serve = 1;
    this.preco = 0;
    this.categoria = '';
    this.imagem = '';
  }
  async selecionarImagem() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecionar imagem',
      buttons: [
        { text: 'Câmera', handler: () => this.pegarImagem(CameraSource.Camera) },
        { text: 'Galeria', handler: () => this.pegarImagem(CameraSource.Photos) },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async pegarImagem(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source
      });

      if (image?.base64String) {
        this.imagem = `data:image/jpeg;base64,${image.base64String}`;
      }
    } catch (err) {
      console.error('Erro ao pegar imagem:', err);
      const a = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Falha ao obter imagem.',
        buttons: ['OK']
      });
      await a.present();
    }
  }
}