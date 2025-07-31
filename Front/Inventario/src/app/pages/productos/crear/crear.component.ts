import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzModalModule,


    ReactiveFormsModule,
    CommonModule
  ]
})
export class CrearComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef<CrearComponent>
  ) {
    this.form = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
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
