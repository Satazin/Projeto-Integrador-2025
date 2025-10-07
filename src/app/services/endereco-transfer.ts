import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnderecoTransferService {
  private endereco: string | null = null;

  setEndereco(endereco: string) {
    this.endereco = endereco;
  }

  getEndereco(): string | null {
    const temp = this.endereco;
    this.endereco = null; // Limpa após a leitura para evitar puxar o mesmo endereço
    return temp;
  }
}