import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Cliente } from './cliente.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clientes: Cliente [] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  constructor(private httpClient: HttpClient) {

  }

  adicionarCliente(nome: string, fone: string, email: string): void {
    const cliente: Cliente = {
      id: null,
      nome: nome,
      fone: fone,
      email: email
    };
    this.httpClient.post<{ mensagem: string, id: string }>(
      'http://localhost:3000/api/clientes',
      cliente
    ).subscribe((dados) => {
      console.log(dados.mensagem)
      cliente.id = dados.id;
      this.clientes.push(cliente);
      this.listaClientesAtualizada.next([...this.clientes]);
    })
  }

  atualizarCliente(id: string, nome: string, fone: string, email: string) {
    const cliente: Cliente = { id, nome, fone, email };
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, cliente)
      .subscribe((res => {
        const copia = [...this.clientes];
        const indice = copia.findIndex(cli => cli.id === cliente.id);
        copia[indice] = cliente;
        this.clientes = copia;
        this.listaClientesAtualizada.next([...this.clientes]);
      }));
  }

  removerCliente (id: string): void{
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`)
    .subscribe(() => {
      console.log ("Remoção feita com sucesso")
      this.clientes = this.clientes.filter((cli) =>{
        return cli.id !== id
      })
      this.listaClientesAtualizada.next([...this.clientes]);
    });
  }

  getCliente(idCliente: string) {
    //return {...this.clientes.find((cli) => cli.id === idCliente)};
    return this.httpClient.get<{
      _id: string, nome: string, fone: string, email:
        string
    }>(`http://localhost:3000/api/clientes/${idCliente}`);
  }

  getClientes(): void {
    this.httpClient.get<{mensagem : string, clientes: any}>(
      'http://localhost:3000/api/clientes'
    )
    .pipe(map((dados) => {
      return dados.clientes.map(cli => {
        return {
          id: cli._id,
          nome: cli.nome,
          fone: cli.fone,
          email: cli.email
        }
      })
    }))
    .subscribe((clientes) => {
      this.clientes = clientes
      this.listaClientesAtualizada.next([...this.clientes])
    })
    //return [...this.clientes];
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }



}
