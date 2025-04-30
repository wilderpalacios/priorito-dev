import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPageRoutingModule } from './form-routing.module';

import { FormPage } from './form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormPageRoutingModule
  ],
  declarations: [FormPage]
})
export class FormPageModule {}
