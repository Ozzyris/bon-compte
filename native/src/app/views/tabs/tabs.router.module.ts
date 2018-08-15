import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { DashboardPageModule } from '../dashboard/dashboard.module';
import { TransactionPageModule } from '../transaction/transaction.module';
import { HistoryPageModule } from '../history/history.module';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        outlet: 'dashboard',
        component: DashboardPageModule
      },
      {
        path: 'transaction',
        outlet: 'transaction',
        component: TransactionPageModule
      },
      {
        path: 'history',
        outlet: 'history',
        component: HistoryPageModule
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
