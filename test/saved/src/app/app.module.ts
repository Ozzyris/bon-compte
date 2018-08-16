// Internal package
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

//External package
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { NativeStorage } from '@ionic-native/native-storage';

//Routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
@NgModule({
	declarations: [
		AppComponent,
		// NativeStorage
	],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

	],
	exports: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
