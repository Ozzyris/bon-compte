import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External packages
import { IonicModule } from '@ionic/angular';

//Views
import { DashboardPage } from './dashboard.page';

//Pipes
import { PipesModule } from "../../pipes/pipe.module";

const routes: Routes = [
    {
        path: '',
        component: DashboardPage,
        outlet: 'dashboard'
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
    declarations: [
        DashboardPage,
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardPageModule {}
