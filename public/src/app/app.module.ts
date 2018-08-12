//INTERNAL PACKAGE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';

//EXTERNAL PACKAGE

//VIEWS
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HistoryComponent } from './views/history/history.component';
import { TransactionComponent } from './views/transaction/transaction.component';
import { LoginComponent } from './views/login/login.component';
import { WalletComponent } from './views/wallet/wallet.component';

//PIPES
import { SanitizerPipe } from './pipes/sanitizer/sanitizer.pipe';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'wallet', component: WalletComponent, data: { title: 'Wallet' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent, data: { title: 'Transaction' } },
  { path: 'history', component: HistoryComponent, data: { title: 'History' } },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HistoryComponent,
    TransactionComponent,
    LoginComponent,
    WalletComponent,
    SanitizerPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
