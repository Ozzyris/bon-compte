import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External packages
import { IonicModule } from '@ionic/angular';

//View
import { HistoryPage } from './history.page';

//Pipes
import { PipesModule } from "../../pipes/pipe.module";

const routes: Routes = [
    {
        path: '',
        component: HistoryPage,
        outlet: 'history'

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
        HistoryPage
    ],
    exports: [
        RouterModule
    ]
})
export class HistoryPageModule {}
