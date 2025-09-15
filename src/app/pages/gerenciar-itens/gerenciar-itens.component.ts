// src/app/pages/gerenciar-itens/gerenciar-itens.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Item, ItemService } from '../../services/item.service';

@Component({
  selector: 'app-gerenciar-itens',
  templateUrl: './gerenciar-itens.component.html',
  styleUrls: ['./gerenciar-itens.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GerenciarItensComponent implements OnInit {
  item: Item = {
    categoria: '',
    nome: '',
    descricao: '',
    serve: '',
    preco: 0,
    imagem: ''
  };

  itensCadastrados: Item[] = [];
  selectedFile: File | null = null;
  selectedImageUrl: string | null = null;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getItems().subscribe(itens => {
      this.itensCadastrados = itens;
    });
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Salva o item no banco de dados
  async salvarItem() {
    try {
      if (this.selectedFile) {
        const base64Image = await this.fileToBase64(this.selectedFile);
        this.item.imagem = base64Image;
      }

      await this.itemService.salvarItem(this.item);
      alert('Item salvo com sucesso!');
      
      this.item = {
        categoria: '',
        nome: '',
        descricao: '',
        serve: '',
        preco: 0,
        imagem: ''
      };
      this.selectedFile = null;
      this.selectedImageUrl = null;
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Falha ao salvar o item.');
    }
  }

  // Converte arquivo para base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}