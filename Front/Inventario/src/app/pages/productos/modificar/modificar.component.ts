import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { Product } from '../Interfaces/productos.interface';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-modificar',
  standalone: true,
  templateUrl: './modificar.component.html',
  styleUrl: './modificar.component.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class ModificarComponent implements OnInit {
  form!: FormGroup;

   constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef<ModificarComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) public producto: Product
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id         : [0],
      nombre     : ['', Validators.required],
      descripcion: [''],
      precio     : [0, [Validators.required, Validators.min(0)]],
      stock      : [0, [Validators.required, Validators.min(0)]]
    });

    Promise.resolve().then(() => {
      if (this.producto) {
        this.form.patchValue(this.producto);
        // this.cdr.markForCheck();
      }
    });
  }


  submit(): void {
    if (this.form.valid) {
      this.modalRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.modalRef.destroy();
  }
}
