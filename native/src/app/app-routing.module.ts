import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', loadChildren: './views/login/login.module#LoginPageModule' },
	{ path: 'wallet', loadChildren: './views/wallet/wallet.module#WalletPageModule' },
	// { path: 'dashboard', loadChildren: './views/dashboard/dashboard.module#DashboardPageModule' },
	// { path: 'transaction', loadChildren: './views/transaction/transaction.module#TransactionPageModule' },
	// { path: 'history', loadChildren: './views/history/history.module#HistoryPageModule' },
	{ path: 'tabs', loadChildren: './views/tabs/tabs.module#TabsPageModule' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})

export class AppRoutingModule{}
