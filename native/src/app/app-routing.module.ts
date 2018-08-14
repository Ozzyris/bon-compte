import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', loadChildren: './views/login/login.module#LoginPageModule' },
	{ path: 'wallet', loadChildren: './views/wallet/wallet.module#WalletPageModule' },
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
