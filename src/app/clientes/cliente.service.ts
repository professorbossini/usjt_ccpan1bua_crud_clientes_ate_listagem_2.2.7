import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Cliente } from './cliente.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clientes: Cliente [] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {

  }

  adicionarCliente(nome: string, fone: string, email: string, imagem: File): void {
    /* cliente: Cliente = {
      id: null,
      nome: nome,
      fone: fone,
      email: email
    };*/
    const dadosCliente = new FormData();
    dadosCliente.append("nome", nome);
    dadosCliente.append('fone', fone);
    dadosCliente.append('email', email);
    dadosCliente.append('imagem', imagem);
    this.httpClient.post < { mensagem: string, cliente: Cliente }>(
      'http://localhost:3000/api/clientes',
      dadosCliente
    ).subscribe((dados) => {
      const cliente: Cliente = {
        id: dados.cliente.id,
        nome: nome,
        fone: fone,
        email: email,
        imagemURL: dados.cliente.imagemURL
      };
      console.log(cliente);
      this.clientes.push(cliente);
      this.listaClientesAtualizada.next([...this.clientes]);
      this.router.navigate(['/']);
    })
  }

  atualizarCliente(id: string, nome: string, fone: string, email: string, imagem: File | string) {
    //const cliente: Cliente = { id, nome, fone, email, imagemURL: null };
    let clienteData: Cliente | FormData;
    if (typeof(imagem) === "object"){
      clienteData = new FormData();
      clienteData.append("id", id);
      clienteData.append("nome", nome);
      clienteData.append("fone", fone);
      clienteData.append("email", email);
      clienteData.append("imagem", imagem, nome);
    }
    else{
      clienteData = {
        id: id,
        nome: nome,
        fone: fone,
        email: email,
        imagemURL: imagem
      }
    }
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, clienteData)
      .subscribe((res => {
        const copia = [...this.clientes];
        const indice = copia.findIndex(cli => cli.id === id);
        const cliente: Cliente = {
          id: id,
          nome: nome,
          fone: fone,
          email: email,
          imagemURL: ''
        }
        copia[indice] = cliente;
        this.clientes = copia;
        this.listaClientesAtualizada.next([...this.clientes]);
        this.router.navigate(['/']);
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
      this.router.navigate(['/']);
    });
  }

  getCliente(idCliente: string) {
    //return {...this.clientes.find((cli) => cli.id === idCliente)};
    return this.httpClient.get<{
      _id: string, nome: string, fone: string, email: string, imagemURL: string}>
      (`http://localhost:3000/api/clientes/${idCliente}`);
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
          email: cli.email,
          imagemURL: cli.imagemURL
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
