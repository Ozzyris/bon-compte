import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TestPage } from './test.page';

const routes: Routes = [
  {
    path: '',
    component: TestPage,
    outlet: 'test'
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        TestPage
    ],
    exports: [
        RouterModule
    ]
})
export class TestPageModule {}
