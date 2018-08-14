//Internal packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//External package
import { IonicModule } from '@ionic/angular';

//Views
import { LoginPage } from './login.page';

//Pipes
import { SanitizerPipe } from '../../pipes/sanitizer/sanitizer.pipe';


const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        LoginPage,
        SanitizerPipe 
    ]
})

export class LoginPageModule {}
