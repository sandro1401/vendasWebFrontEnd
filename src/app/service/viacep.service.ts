import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ViaCepResult } from '../models/viaCepResult';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViacepService {
  apiUrl: string = environment.viaCepUrl;

  constructor(private httpClient: HttpClient) { }

  getEnderecoByCep(cep: string){
    return this.httpClient.get<ViaCepResult>
      (this.apiUrl + cep + "/json/")
      .pipe(
        map((response)=> {
         
          return response;
        })
      )
    }
}
