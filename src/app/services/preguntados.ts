import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Pregunta {
  pregunta: string;
  respuestaCorrecta: string;
  respuestasIncorrectas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private http = inject(HttpClient);
  private jsonUrl = 'preguntas.json'; 


  obtenerPreguntas() {
    return this.http.get<Pregunta[]>(this.jsonUrl);
  }
}