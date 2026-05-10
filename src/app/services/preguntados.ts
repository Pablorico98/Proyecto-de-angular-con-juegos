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
  private jsonUrl = 'https://mocki.io/v1/658d95e2-0aff-49c6-8460-8214008355f3'; 


  obtenerPreguntas() {
    return this.http.get<Pregunta[]>(this.jsonUrl);
  }
}