import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
declare const __firebase_config: string;

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.page.html',
  styleUrls: ['./item-edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ItemEditPage implements OnInit {
  item: any = {
    id: null,
    nome: '',
    preco: 0,
    descricao: '',
    imagem: '',
    serve: 1,
    categoria: '',
  };

  loading = true;
  errorMessage: string | null = null;

  newImageBase64: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rt: RealtimeDatabaseService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {
  }

  async ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const passedItem = nav?.extras?.state?.['item'];
    if (passedItem) {
      Object.assign(this.item, passedItem);
      this.loading = false;
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID do item não informado para edição.';
      this.loading = false;
      return;
    }

    try {
      const snapshot: any = await this.rt.get(`pedidos/${id}`);
      if (snapshot.exists()) {
        Object.assign(this.item, { id, ...snapshot.val() });
      } else {
        this.errorMessage = 'Item não encontrado.';
      }
    } catch (err) {
      console.error('Erro ao buscar item:', err);
      this.errorMessage = 'Erro ao carregar item para edição.';
    } finally {
      this.loading = false;
    }
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
        this.item.imagem = `data:image/jpeg;base64,${image.base64String}`;
      }
    } catch (err) {
      console.error('Erro ao pegar imagem:', err);
      const a = await this.alertController.create({
        header: 'Erro',
        message: 'Falha ao obter imagem.',
        buttons: ['OK']
      });
      await a.present();
    }
  }


  async salvarAlteracoes() {
    if (!this.item.id) {
      await this.showAlert('Erro', 'Item inválido para salvar.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando alterações...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      let imageBase64ToSave = this.item.imagem;

      if (this.newImageBase64) {
        loading.message = 'Atualizando imagem Base64...';
        imageBase64ToSave = this.newImageBase64;
        this.newImageBase64 = null;
      }
      const dadosParaSalvar = {
        nome: this.item.nome,
        preco: parseFloat(String(this.item.preco).replace(',', '.')) || 0,
        descricao: this.item.descricao || '',
        imagem: imageBase64ToSave,
        serve: parseInt(this.item.serve, 10) || 1,
        categoria: this.item.categoria || '',
      };

      loading.message = 'Atualizando...';
      await this.rt.update(`pedidos/${this.item.id}`, dadosParaSalvar);

      await this.showAlert('Sucesso!', 'Item atualizado com sucesso!', [
        { text: 'OK', handler: () => { this.router.navigate(['/pedidos']); } }
      ]);

    } catch (error) {
      console.error('Erro ao salvar item:', error);
      await this.showAlert('Erro Crítico', 'Falha ao salvar item ou converter imagem. Verifique o console.');
    } finally {
      await loading.dismiss();
    }
  }

  async showAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });
    await alert.present();
  }
}