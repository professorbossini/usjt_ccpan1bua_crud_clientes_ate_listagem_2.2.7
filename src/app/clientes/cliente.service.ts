import { Injectable } from '@angular/core';

import { Cliente } from './cliente.model';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  private clientes: Cliente [] = [];

  getClientes(): Cliente[] {
    return [...this.clientes];
  }

  private listaClientesAtualizada = new Subject <Cliente[]>();

  adicionarCliente (nome: string, fone: string, email: string): void{
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email
    };
    this.clientes.push(cliente);
    this.listaClientesAtualizada.next([...this.clientes]);
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }



}
