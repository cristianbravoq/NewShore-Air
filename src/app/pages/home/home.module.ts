import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from 'src/material.module';

import { HomeComponent } from './home.component';
import { SearchComponent } from 'src/app/shareds/search/search.component';


@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class HomeModule { }
