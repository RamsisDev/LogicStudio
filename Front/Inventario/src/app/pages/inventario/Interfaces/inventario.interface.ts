
export interface Transaccion {
  id: number;

  productoId: number;

  fecha: string | Date;

  tipoTransaccion: string;

  precioTotal: number;

  precioUnitario: number;

  detalle?: string;

  cantidad: number;
}
