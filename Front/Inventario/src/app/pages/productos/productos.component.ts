import { Component } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Categoria, Product } from '../productos/Interfaces/productos.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductosApiService } from '../../services/productos-api.service';
import { catchError, finalize, of } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CrearComponent } from './crear/crear.component';
import { ModificarComponent } from './modificar/modificar.component';

interface Filtro {
  nombre?: string;
  categoriaId?: number;
  fecha?: Date | null;
  precioMin?: number;
  precioMax?: number;
}
@Component({
  selector: 'app-productos-lista',
  standalone: true,
  imports: [
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSliderModule,
    NzIconModule,
    NzButtonComponent,
    NzColDirective,
    NzRowDirective,


    NgFor,
    CommonModule,
    ReactiveFormsModule,

    CrearComponent,
    ModificarComponent
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})

export class ProductosComponent {
  data: Product[] = [];
  categorias: Categoria[] = [];

  total      = 0;
  loading    = false;
  hasError   = false;

  pageIndex  = 1;
  pageSize   = 10;

  precioRange: [number, number] = [0, 100000];
  filtro: Filtro = { precioMin: 0, precioMax: 99999 };

  constructor(
    private api: ProductosApiService,
    private msg: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.api.getCategorias().subscribe({
      next: cats => (this.categorias = cats),
      error: () => this.msg.error('No se pudieron cargar las categorías')
    });

    this.loadData();
  }

  loadData(): void {
    this.loading  = true;
    this.hasError = false;

    this.api.list(this.pageIndex, this.pageSize, this.filtro)
      .pipe(
        catchError(err => {
          this.hasError = true;
          this.msg.error('Error al cargar productos');
          console.error(err);
          return of({ items: [], total: 0 });
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(({ items, total }) => {
        this.data  = items;
        this.total = total;
      });
  }

  editarProducto(id: number): void {
    const producto = this.data.find(p => p.id === id);
    if (!producto) {
      this.msg.error('Producto no encontrado');
      return;
    }

  const modalRef = this.modal.create({
    nzTitle: `Modificar producto #${producto.id}`,
    nzContent: ModificarComponent,
    nzFooter: null,
    nzWidth: 600,
    nzClosable: true,
    nzMaskClosable: false,
    nzData: producto
  });

  modalRef.afterClose.subscribe((updated?: Product) => {
    if (updated) {
      this.api.update(updated).subscribe({
        next: () => {
          this.msg.success(`Producto «${updated.nombre}» actualizado`);
          this.loadData();
        },
        error: () => this.msg.error('No se pudo actualizar el producto')
      });
    }
  });
}




  eliminarProducto(id: number): void {
    this.api.delete(id)
      .subscribe({
        next: () => {
          this.msg.success('Producto eliminado');
          this.loadData();
        },
        error: () => this.msg.error('No se pudo eliminar el producto')
      });
  }

  crearProducto(): void {
    this.modal.create({
      nzTitle: 'Crear Producto',
      nzContent: CrearComponent,
      nzFooter: null,
      nzWidth: 600,
      nzClosable: true,
      nzMaskClosable: false,
      nzOnOk: () => {},
    }).afterClose.subscribe((producto) => {
    if (producto) {
     this.api.create(producto)
     .subscribe({
     next:() => {
      this.msg.success(`Producto ${producto.nombre} creado`);
      this.loadData();
     },
     error: () => this.msg.error("No se pudo crear el producto")
     })
    }
  });
  }


  aplicarFiltros(): void {
  const { nombre, categoriaId, fecha, precioMin, precioMax } = this.filtro;

  this.data = this.data.filter(p => {
    const matchNombre = !nombre || p.nombre.toLowerCase().includes(nombre.toLowerCase());
    const matchPrecio = (!precioMin || p.precio >= precioMin) &&
                        (!precioMax || p.precio <= precioMax);

    return matchNombre  && matchPrecio;
  });
}


  onQueryParamsChange({ pageIndex, pageSize }: NzTableQueryParams): void {
    this.pageIndex = pageIndex;
    this.pageSize  = pageSize;
    this.loadData();
  }

  onPrecioRangeChange([min, max]: [number, number]): void {
    this.filtro.precioMin = min;
    this.filtro.precioMax = max;
  }

  resetFiltros(): void {
    this.filtro       = { precioMin: 0, precioMax: 99999, fecha: null };
    this.precioRange  = [0, 10000];
    this.pageIndex    = 1;
    this.loadData();
  }
}
