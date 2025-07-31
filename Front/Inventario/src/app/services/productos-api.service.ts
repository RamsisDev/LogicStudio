import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria, Product } from '../pages/productos/Interfaces/productos.interface';

/** Filtros que acepta la API */
export interface Filtro {
  nombre?: string;
  categoriaId?: number;
  fecha?: Date | null;
  precioMin?: number;
  precioMax?: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private readonly baseUrl = 'http://localhost:5015/';

  constructor(private http: HttpClient) {}

  list(pageNumber: number, pageSize: number, filtro: Filtro): Observable<ListResponse<Product>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize',   pageSize);

    if (filtro.nombre?.trim())       params = params.set('nombre', filtro.nombre);
    if (filtro.categoriaId)          params = params.set('categoriaId', filtro.categoriaId);
    if (filtro.fecha)                params = params.set('fecha', filtro.fecha.toISOString());
    if (filtro.precioMin !== null && filtro.precioMin !== undefined) params = params.set('precioMin', filtro.precioMin);
    if (filtro.precioMax !== null && filtro.precioMax !== undefined) params = params.set('precioMax', filtro.precioMax);

    return this.http
      .get<Product[]>(`${this.baseUrl}Producto/Productos`, { params, observe: 'response' })
      .pipe(
        map((res: HttpResponse<Product[]>) => ({
          items: res.body ?? [],
          total: Number(res.headers.get('X-Total-Count')) || 0
        }))
      );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}Producto/${id}`);
  }

  create(dto: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}Producto`, dto);
  }

  update(dto: Product): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}Producto/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Producto/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}Categorias`);
  }
}
