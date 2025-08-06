import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule }   from 'ng-zorro-antd/card';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzInputModule }  from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzIconModule }   from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TransaccionApiService, TxFiltro } from '../../services/transacciones.service';
import { Transaccion } from './Interfaces/inventario.interface';
import { CrearComponent } from './crear/crear.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ModificarComponent } from './modificar/modificar.component';

@Component({
  selector   : 'app-inventario',
  standalone : true,
  templateUrl: './inventario.component.html',
  styleUrl   : './inventario.component.scss',
  imports: [
    /* Angular */
    CommonModule, NgFor, FormsModule, ReactiveFormsModule,
    /* NG-ZORRO */
    NzCardModule, NzTableModule, NzInputModule, NzSelectModule,
    NzDatePickerModule, NzSliderModule, NzIconModule,
    NzButtonModule, NzModalModule, NzRowDirective, NzColDirective
  ]
})
export class InventarioComponent implements OnInit {

  private api  = inject(TransaccionApiService);
  private msg  = inject(NzMessageService);
  private modal= inject(NzModalService);

  data: Transaccion[] = [];
  total     = 0;
  pageIndex = 1;
  pageSize  = 10;
  loading   = false;

  tipos = ['VENTA', 'COMPRA', 'OTRO'];
  filtro: TxFiltro = { tipoTransaccion: null, fecha: null };

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    this.api.list(this.pageIndex, this.pageSize, this.filtro).subscribe({
      next: res => { this.data = res.items; this.total = res.total; this.loading = false; },
      error: ()  => this.loading = false
    });
  }

  /* —— Acciones —— */
  nuevaTransaccion(): void {
    this.modal.create<CrearComponent, void, Transaccion | null>({
      nzTitle : 'Nueva transacción',
      nzContent: CrearComponent,
      nzFooter : null,
      nzWidth  : 600,
      nzMaskClosable: false
    }).afterClose.subscribe(tx => {
      if (!tx) return;
      this.msg.success('Transacción creada');
      this.loadData();
    });
  }

  editar(id: number)   {
    const transaccionId = this.data.find(p => p.id === id);
    const modalRef = this.modal.create<ModificarComponent>({
      nzTitle: `Modificar transacción #${id}`,
      nzContent: ModificarComponent,
      nzFooter: null,
      nzWidth: 600,
      nzMaskClosable: false,
      nzData:  transaccionId!.id

    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }


  eliminar(id: number) {
    this.api.delete(id).subscribe({
      next: () => {
          this.msg.success('Transaccion eliminada');
          this.loadData();
        },
        error: () => this.msg.error('No se pudo eliminar la transaccion')

        });
  }

  aplicarFiltros() { this.pageIndex = 1; this.loadData(); }
  resetFiltros()   { this.filtro = { tipoTransaccion: null, fecha: null }; this.loadData(); }

  get dataFiltrada(): Transaccion[] {
    return this.data.filter(tx => {
      const okTipo  = !this.filtro.tipoTransaccion || tx.tipoTransaccion === this.filtro.tipoTransaccion;
      const okFecha = !this.filtro.fecha ||
                      new Date(tx.fecha).toDateString() === this.filtro.fecha.toDateString();
      return okTipo && okFecha;
    });
  }
}
