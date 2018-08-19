// Internal package
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//services
import { interceptor_service } from './services/interceptor/interceptor.service';

//External package
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

//Routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
	declarations: [
		AppComponent
	],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot(),
	],
	providers: [
		StatusBar,
		SplashScreen,
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: interceptor_service,
			multi: true
		}

	],
	exports: [
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
