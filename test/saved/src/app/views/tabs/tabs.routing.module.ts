import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
// import { DashboardPageModule } from '../dashboard/dashboard.module';
// import { TransactionPageModule } from '../transaction/transaction.module';
// import { HistoryPageModule } from '../history/history.module';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'dashboard',
                outlet: 'dashboard',
                loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
            },
            {
                path: 'transaction',
                outlet: 'transaction',
                loadChildren: '../transaction/transaction.module#TransactionPageModule'
            },
            {
                path: 'history',
                outlet: 'history',
                loadChildren: '../history/history.module#HistoryPageModule'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/(dashboard:dashboard)',
        // pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TabsPageRoutingModule {}
