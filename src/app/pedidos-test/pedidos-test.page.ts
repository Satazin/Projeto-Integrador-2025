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
  ActionSheetController
} from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-pedidos-test',
  templateUrl: './pedidos-test.page.html',
  styleUrls: ['./pedidos-test.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonInput, IonButton, IonItem, IonSelect, IonSelectOption
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
    { id: 'poke', nome: 'POKE' },
    { id: 'temaki', nome: 'TEMAKI' },
    { id: 'yakisoba', nome: 'YAKISOBA' },
    { id: 'sushi', nome: 'SUSHI' },
    { id: 'niguiris', nome: 'NIGUIRIS' },
    { id: 'hot', nome: 'PORÇÕES HOT' },
    { id: 'urumakis', nome: 'URUMAKIS' },
    { id: 'acompanhamentos', nome: 'ACOMPANHAMENTOS' },
    { id: 'combos', nome: 'COMBOS' },
    { id: 'bebidas', nome: 'BEBIDAS' },
    { id: 'sobremesas', nome: 'SOBREMESAS' }
  ];

  constructor(
    private rt: RealtimeDatabaseService,
    private ar: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
  }

  // SALVAR NOVO PEDIDO
  salvar(){
    this.rt.add('pedidos', {
      nome: this.nome,
      descricao: this.descricao,
      serve: this.serve,
      preco: this.preco,
      categoria: this.categoria,
      imagem: this.imagem
    })
    .then((res: any) => {
      console.log('Salvo com sucesso', res);
      this.listar();       // atualiza lista
      this.limparFormulario(); // limpa form
    })
    .catch((err: any) => {
      console.log('Falhou', err);
    });
  }

  // LISTAR PEDIDOS
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

  // LIMPAR FORMULÁRIO
  limparFormulario() {
    this.nome = '';
    this.descricao = '';
    this.serve = 1;
    this.preco = 0;
    this.categoria = '';
    this.imagem = '';
  }

  // ACTION SHEET: ESCOLHER CÂMERA OU GALERIA
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

  // PEGAR IMAGEM BASE64
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
    }
  }
}
