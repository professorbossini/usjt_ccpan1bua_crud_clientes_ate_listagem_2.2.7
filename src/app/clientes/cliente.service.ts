import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Cliente } from './cliente.model';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private httpClient : HttpClient) {

  }

  private clientes: Cliente [] = [];

  getClientes(): void {
    this.httpClient.get<{mensagem : string, clientes: Cliente[]}>(
      'http://localhost:3000/api/clientes'
    ).subscribe((dados) => {
      this.clientes = dados.clientes
      this.listaClientesAtualizada.next([...this.clientes])
    })
    //return [...this.clientes];
  }

  private listaClientesAtualizada = new Subject <Cliente[]>();

  adicionarCliente (nome: string, fone: string, email: string): void{
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email
    };
    this.httpClient.post<{mensagem: string}>(
      'http://localhost:3000/api/clientes',
      cliente
    ).subscribe((dados) => {
      console.log(dados.mensagem)
      this.clientes.push(cliente);
      this.listaClientesAtualizada.next([...this.clientes]);
    })
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }



}
