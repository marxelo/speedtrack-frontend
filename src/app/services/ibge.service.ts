import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for API response
export interface IbgeState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IbgeCity {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private readonly API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) {}

  getStates(): Observable<IbgeState[]> {
    // ?orderBy=nome asks IBGE to sort alphabetically
    return this.http.get<IbgeState[]>(`${this.API_URL}/estados?orderBy=nome`);
  }

  getCities(ufSigla: string): Observable<IbgeCity[]> {
    return this.http.get<IbgeCity[]>(`${this.API_URL}/estados/${ufSigla}/municipios?orderBy=nome`);
  }
}