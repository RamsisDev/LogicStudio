import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria, Product } from '../pages/productos/Interfaces/productos.interface';
import { Transaccion } from '../pages/inventario/Interfaces/inventario.interface';

export interface TxFiltro {
  fecha?: Date | null;
  tipoTransaccion?: string | null;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class TransaccionApiService {
  private readonly baseUrl = 'http://localhost:5152/api/Transacciones';

  constructor(private http: HttpClient) {}

  list(page: number, size: number, filtro: TxFiltro): Observable<ListResponse<Transaccion>> {

    let params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize',   size);

    if (filtro.tipoTransaccion)
      params = params.set('tipoTransaccion', filtro.tipoTransaccion);

    if (filtro.fecha)
      params = params.set('fecha', filtro.fecha.toISOString());

    return this.http
      .get<Transaccion[]>(this.baseUrl, { params, observe: 'response' })
      .pipe(
        map((res: HttpResponse<Transaccion[]>) => ({
          items: res.body ?? [],
          total: Number(res.headers.get('X-Total-Count') ?? 0)
        }))
      );
  }

  /* ---------- CRUDs simples ---------- */
  getById(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.baseUrl}/${id}`);
  }

  create(dto: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.baseUrl, dto);
  }


  update(dto: Transaccion): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
