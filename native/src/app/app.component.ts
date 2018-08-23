import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, Event, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    is_menu_display: Boolean = false;
    is_menu_active: string = 'dashboard';
    is_side_menu_active: Boolean = false;

    constructor( private storage: Storage, public navCtrl: NavController, private router: Router, private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar ) {
        this.initializeApp();
        this.menu_manager();
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    menu_manager(){
        this.router.events.subscribe((event: Event) => {
            if(event instanceof NavigationEnd ){
                if( event.url.indexOf("dashboard") >= 0 || event.url.indexOf("transaction") >= 0 || event.url.indexOf("history") >= 0 ){
                this.is_menu_display = true;
                }else{
                    this.is_menu_display = false;
                }
            }
          });
    }

    click_menu( type ){
        this.navCtrl.goRoot('/' + type);
        this.is_menu_active = type;
    }

    logged_out(){
        this.storage.remove('session')
        this.storage.remove('wallet_id')
        this.navCtrl.goRoot('/login');
        this.is_side_menu_active = false;
    }

    change_wallet(){
        this.storage.remove('wallet_id')
        this.navCtrl.goRoot('/wallet');
        this.is_side_menu_active = false;
    }
}
