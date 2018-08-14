// Internal package
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

//External package
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { TimeAgoPipe } from 'angular2-moment';
import { MomentModule } from 'angular2-moment';
// import { NativeStorage } from '@ionic-native/native-storage';

//Routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//pipes
// import { SanitizerPipe } from './pipes/sanitizer/sanitizer.pipe';

@NgModule({
	declarations: [
		AppComponent,
		// NativeStorage
		// SanitizerPipe
	],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		MomentModule

	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
