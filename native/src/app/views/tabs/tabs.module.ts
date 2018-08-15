import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

//Router
import { TabsPageRoutingModule } from './tabs.router.module';

//Routes
import { DashboardPageModule } from '../dashboard/dashboard.module';
import { TransactionPageModule } from '../transaction/transaction.module';
import { HistoryPageModule } from '../history/history.module';

// Views
import { TabsPage } from './tabs.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TabsPageRoutingModule,
        DashboardPageModule,
        TransactionPageModule,
        HistoryPageModule
    ],
    declarations: [TabsPage]
})
export class TabsPageModule {}
