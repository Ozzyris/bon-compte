import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External packages
import { IonicModule } from '@ionic/angular';
import { TimeAgoPipe } from 'angular2-moment';


import { WalletPage } from './wallet.page';

const routes: Routes = [
    {
        path: '',
        component: WalletPage
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
        WalletPage,
        TimeAgoPipe
    ]
})
export class WalletPageModule {}
