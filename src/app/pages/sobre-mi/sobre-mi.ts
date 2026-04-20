import { Component, inject, signal, OnInit } from '@angular/core';
import { GithubService } from '../../services/github'; 
@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [],
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css'
})
export class SobreMi implements OnInit {
  
  private githubService = inject(GithubService); //injectamos el servicio creado en service/github.ts
  perfil = signal<any>(null); // Acá preparamos el "paquete" 

  ngOnInit() {
    this.githubService.traerDatos('Pablorico98', this.perfil);
  }
}