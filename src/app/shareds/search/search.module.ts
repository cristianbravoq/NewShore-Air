import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialExampleModule } from 'src/material.module';
import { ReactiveFormsModule } from '@angular/forms';

// import { SearchComponent } from './search.component';

@NgModule({
  declarations: [
    // SearchComponent,
  ],
  imports: [
    CommonModule,
    MaterialExampleModule,
    ReactiveFormsModule,
  ],
  exports: [
  ]
})
export class SearchModule { }
