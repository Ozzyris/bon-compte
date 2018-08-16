import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External packages
import { IonicModule } from '@ionic/angular';

//View
import { WalletPage } from './wallet.page';

//Pipes
import { PipesModule } from "../../pipes/pipe.module";

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
        RouterModule.forChild(routes),
        PipesModule
    ],
    declarations: [
        WalletPage
    ],
    exports: []
})
export class WalletPageModule {}
