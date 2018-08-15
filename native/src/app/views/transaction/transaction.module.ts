import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External packages
import { IonicModule } from '@ionic/angular';

//View
import { TransactionPage } from './transaction.page';

//Pipes
import { PipesModule } from "../../pipes/pipe.module";

const routes: Routes = [
  {
    path: '',
    component: TransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [TransactionPage]
})
export class TransactionPageModule {}
