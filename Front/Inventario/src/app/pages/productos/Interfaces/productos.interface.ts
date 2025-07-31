
export interface Product {
  id: number;

  nombre: string;

  descripcion?: string;

  precio: number;

  stock: number;
}

export interface Categoria {
  id: number;

  nombre: string;

  descripcion?: string;
}

export interface ProductoCategoria {
  id: number;

  productoId: number;

  categoriaId: number;
}

