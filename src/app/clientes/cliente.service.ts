import { Injectable } from '@angular/core';

import { Cliente } from './cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  private clientes: Cliente [] = [
    {
      nome: 'Maria',
      fone: '11223344',
      email: 'maria@email.com'
    }
  ];

  getClientes(): Cliente[] {
    return [...this.clientes];
  }

  adicionarCliente (nome: string, fone: string, email: string): void{
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email
    };
    this.clientes.push(cliente);
  }



}
