//INTERNAL PACKAGE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

//EXTERNAL PACKAGE
import { MomentModule } from 'angular2-moment';

//VIEWS
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HistoryComponent } from './views/history/history.component';
import { TransactionComponent } from './views/transaction/transaction.component';
import { WalletComponent } from './views/wallet/wallet.component';

//PIPES
import { SanitizerPipe } from './pipes/sanitizer/sanitizer.pipe';
import { ConvertorPipe } from './pipes/convertor/convertor.pipe';

const routes: Routes = [
  { path: 'wallet', component: WalletComponent, data: { title: 'Wallet' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: '',   redirectTo: 'wallet', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent, data: { title: 'Transaction' } },
  { path: 'history', component: HistoryComponent, data: { title: 'History' } },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HistoryComponent,
    TransactionComponent,
    WalletComponent,
    SanitizerPipe,
    ConvertorPipe
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
