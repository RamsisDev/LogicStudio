import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule }   from 'ng-zorro-antd/form';
import { NzInputModule }  from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzIconModule }   from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ProductosApiService }   from '../../../services/productos-api.service';
import { TransaccionApiService } from '../../../services/transacciones.service';
import { Product }     from '../../productos/Interfaces/productos.interface';
import { Transaccion } from '../Interfaces/inventario.interface';

@Component({
  selector   : 'app-crear',
  standalone : true,
  templateUrl: './crear.component.html',
  styleUrl   : './crear.component.scss',
  imports: [
    CommonModule, NgFor, ReactiveFormsModule,
    NzFormModule, NzInputModule, NzSelectModule,
    NzButtonModule, NzIconModule, NzModalModule
  ]
})
export class CrearComponent implements OnInit {
  private fb       = inject(FormBuilder);
  private modalRef = inject<NzModalRef<CrearComponent>>(NzModalRef);
  private prodApi  = inject(ProductosApiService);
  private txApi    = inject(TransaccionApiService);
  private msg      = inject(NzMessageService);

  readonly tipos = ['COMPRA', 'VENTA', 'OTRO'];

  allProductos: Product[] = [];
  productos   : Product[] = [];
  guardando   = false;

  form = this.fb.group({
    id             : 0,
    productoId     : [null, Validators.required],
    tipoTransaccion: ['', [Validators.required, Validators.pattern(/^(COMPRA|VENTA|OTRO)$/)]],
    detalle        : [''],
    fecha          : [new Date(), Validators.required],
    precioUnitario : [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
    cantidad       : [0, [Validators.required, Validators.min(1)]],
    precioTotal    : [{ value: 0, disabled: true }]
  });

  ngOnInit(): void {
    this.prodApi.list(1, 1000, {} as any).subscribe(res => {
      this.allProductos = res.items;
      this.productos    = res.items;
    });

    this.form.get('productoId')!.valueChanges.subscribe(id => {
      const p = this.allProductos.find(x => x.id === id);
      if (p) this.form.get('precioUnitario')!.setValue(p.precio, { emitEvent: true });
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
    const total = pu * c;
    const totalRounded = Math.round(total * 100) / 100;

    this.form.get('precioTotal')!
        .setValue(totalRounded, { emitEvent: false });
  }

  searchProduct(q: string): void {
    q = q.trim().toLowerCase();
    this.productos = q
      ? this.allProductos.filter(p => p.nombre.toLowerCase().includes(q))
      : this.allProductos;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const dto: Transaccion = {
        id: v.id ?? 0,
        productoId     : v.productoId!,
        fecha          : v.fecha!,
        tipoTransaccion: v.tipoTransaccion!,
        precioUnitario : v.precioUnitario!,
        precioTotal    : this.form.get('precioTotal')!.value as number,
        Cantidad       : v.cantidad!,
        detalle        : v.detalle ?? ''
     };
    this.guardando = true;

    this.txApi.create(dto).subscribe({
      next : () => { this.msg.success('Transacción creada'); this.modalRef.close(true); },
      error: (err: HttpErrorResponse) => {
        const txt = err.status === 0
          ? 'Sin conexión con el servidor.'
          : (err.error?.mensaje || err.error || 'Error al guardar.');
        this.msg.error(txt);
        this.guardando = false;
      }
    });
  }

  cancel(): void { this.modalRef.close(null); }
}
