import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* NG-ZORRO */
import { NzCardModule }      from 'ng-zorro-antd/card';
import { NzTableModule }     from 'ng-zorro-antd/table';
import { NzInputModule }     from 'ng-zorro-antd/input';
import { NzSelectModule }    from 'ng-zorro-antd/select';
import { NzDatePickerModule }from 'ng-zorro-antd/date-picker';
import { NzSliderModule }    from 'ng-zorro-antd/slider';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    FormsModule,
    /* Angular standalone directives (si tu versión lo requiere) */
    NgFor,
    NgIf,

    /* NG-ZORRO */
    NzCardModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSliderModule
  ],
  exports: [
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSliderModule,
  ]
})
export class ProductosModule { }
