import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'test',
                outlet: 'test',
                loadChildren: '../test/test.module#TestPageModule'
            },
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
        redirectTo: '/tabs/(history:history)',
        // pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TabsPageRoutingModule {}
