import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { debounceTime } from 'rxjs';
import { ProductosApiService } from '../../../services/productos-api.service';
import { TransaccionApiService } from '../../../services/transacciones.service';
import { Product } from '../../productos/Interfaces/productos.interface';
import { Transaccion } from '../Interfaces/inventario.interface';
import { CommonModule, NgFor } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-modificar',
  imports: [
    CommonModule, NgFor, ReactiveFormsModule,
    NzFormModule, NzInputModule, NzSelectModule,
    NzButtonModule, NzIconModule, NzModalModule
  ],
  templateUrl: './modificar.component.html',
  styleUrl: './modificar.component.scss'
})
export class ModificarComponent {

  private fb       = inject(FormBuilder);
  private modalRef = inject<NzModalRef<ModificarComponent>>(NzModalRef);
  private prodApi  = inject(ProductosApiService);
  private txApi    = inject(TransaccionApiService);
  private msg      = inject(NzMessageService);

  constructor(
    @Inject(NZ_MODAL_DATA) public transaccionId: number
  ) {
  }

  guardando = false;
  allProductos: Product[] = [];
  productos   : Product[] = [];
  readonly tipos = ['COMPRA', 'VENTA'];

  form = this.fb.group({
    id              : [0],
    productoId      : [{ value: 0, disabled: true }, Validators.required],
    tipoTransaccion : [{ value: '', disabled: true }, Validators.required],
    detalle         : [''],
    fecha           : [{ value: new Date(), disabled: true }, Validators.required],
    precioUnitario  : [{ value: 0, disabled: false }, [Validators.required, Validators.min(0)]],
    cantidad        : [0, [Validators.required, Validators.min(1)]],
    precioTotal     : [{ value: 0, disabled: true }]
  });


  ngOnInit(): void {
    this.prodApi.list(1, 1000, {} as any).subscribe(res => {
      this.allProductos = res.items;
      this.productos    = res.items;
    });

    console.log(this.transaccionId)
    this.txApi.getById(this.transaccionId).subscribe(tx => {
      const fechaComoDate = new Date(tx.fecha);
      this.form.patchValue({
        id             : tx.id,
        productoId     : tx.productoId,
        tipoTransaccion: tx.tipoTransaccion,
        detalle        : tx.detalle,
        fecha          : fechaComoDate,
        precioUnitario : tx.precioUnitario,
        cantidad       : tx.Cantidad,
        precioTotal    : tx.precioTotal
      });
    });

    this.form.get('cantidad')!.valueChanges
      .pipe(debounceTime(100))
      .subscribe(() => this.recalcularTotal());

    this.form.get('precioUnitario')!.valueChanges
      .pipe(debounceTime(100))
      .subscribe(() => this.recalcularTotal());
  }

  private recalcularTotal(): void {
    const pu = this.form.get('precioUnitario')!.value ?? 0;
    const c  = this.form.get('cantidad')!.value ?? 0;
    const tot = Math.round(pu * c * 100) / 100;
    this.form.get('precioTotal')!.setValue(tot, { emitEvent: false });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const dto: Transaccion = {
      id               : v.id!,
      productoId       : v.productoId!,
      fecha            : v.fecha!,
      tipoTransaccion  : v.tipoTransaccion!,
      precioUnitario   : v.precioUnitario!,
      precioTotal      : v.precioTotal!,
      Cantidad         : v.cantidad!,
      detalle          : v.detalle ?? ''
    };

    this.guardando = true;
    this.txApi.update(dto).subscribe({
      next: () => {
        this.msg.success('Transacción actualizada');
        this.modalRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        const txt = err.status === 0
          ? 'Sin conexión con el servidor.'
          : (err.error?.mensaje || err.error || 'Error al actualizar.');
        this.msg.error(txt);
        this.guardando = false;
      }
    });
  }

  cancel(): void {
    this.modalRef.close(null);
  }
}
