//INTERNAL PACKAGE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

//EXTERNAL PACKAGE

//VIEWS
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HistoryComponent } from './views/history/history.component';
import { TransactionComponent } from './views/transaction/transaction.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
  { path: '',   redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'transaction', component: TransactionComponent, data: { title: 'Transaction' } },
  { path: 'history', component: HistoryComponent, data: { title: 'History' } },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HistoryComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
