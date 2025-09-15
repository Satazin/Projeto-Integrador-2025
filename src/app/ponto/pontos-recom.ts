// src/app/services/pontos-recom.service.ts
import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set, Database } from 'firebase/database';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class PontoService {
  private db: Database;
  
  constructor(private authService: AuthService) {
    this.db = getDatabase();
  }

  // Método para ler a pontuação do usuário logado
  async lerPontos(): Promise<number> {
    const usuarioLogado = this.authService.usuarioLogado;

    if (!usuarioLogado) {
      console.error("Erro: Nenhum usuário logado.");
      return 0;
    }

    const uid = usuarioLogado.uid;
    const userPontosRef = ref(this.db, `usuarios/${uid}/pontos`);
    
    try {
      const snapshot = await get(userPontosRef);
      return snapshot.exists() ? snapshot.val() : 0;
    } catch (error) {
      console.error("Erro ao ler os pontos:", error);
      return 0;
    }
  }

  // Método para adicionar/remover pontos do usuário logado
  async adicionarPontos(valorTotal: number, fatorConversao: number = 4.6) {
    const usuarioLogado = this.authService.usuarioLogado;

    if (!usuarioLogado) {
      console.error("Erro: Nenhum usuário logado. Não é possível adicionar pontos.");
      return;
    }
    
    const pontosGanhos = Math.floor(valorTotal * fatorConversao);

    if (pontosGanhos > 0) {
      const uid = usuarioLogado.uid;
      const userPontosRef = ref(this.db, `usuarios/${uid}/pontos`);
      
      const snapshot = await get(userPontosRef);
      const pontosAtuais = snapshot.exists() ? snapshot.val() : 0;
      
      const novosPontos = pontosAtuais + pontosGanhos;
      
      try {
        await set(userPontosRef, novosPontos);
        console.log(`Pontos adicionados: ${pontosGanhos}. Total agora é: ${novosPontos}`);
      } catch (error) {
        console.error("Erro ao adicionar pontos:", error);
      }
    } else {
      console.log('Valor total insuficiente para gerar pontos.');
    }
  }

   async removerPontos(pontosRemover: number = 10) {
    const usuarioLogado = this.authService.usuarioLogado;

    if (!usuarioLogado) {
      console.error("Erro: Nenhum usuário logado. Não é possível remover pontos.");
      return;
    }
    
    const uid = usuarioLogado.uid;
    const userPontosRef = ref(this.db, `usuarios/${uid}/pontos`);
    
    try {
      const snapshot = await get(userPontosRef);
      const pontosAtuais = snapshot.exists() ? snapshot.val() : 0;
      
      const novosPontos = Math.max(0, pontosAtuais - pontosRemover);
      
      await set(userPontosRef, novosPontos);
      console.log(`Pontos removidos: ${pontosRemover}. Total agora é: ${novosPontos}`);
    } catch (error) {
      console.error("Erro ao remover pontos:", error);
    }
  }
  
}