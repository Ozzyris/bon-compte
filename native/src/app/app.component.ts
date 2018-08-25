//angular
import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { environment } from './../environments/environment';

// ionic plugin
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';

//services
import { common_service } from './services/common/common.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [common_service]
})

export class AppComponent {
    api_url: string = environment.api_url + 'uploads/';
    is_menu_display: Boolean = false;
    is_menu_active: string = 'dashboard';
    is_side_menu_active: Boolean = false;
    user_details: any = {};

    constructor( public events: Events, private storage: Storage, public navCtrl: NavController, private router: Router, private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private common_service: common_service ) {
        this.initializeApp();
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
        this.menu_manager();
        this.left_menu_action();
        this.get_user_detail();
        this.get_user_detail_on_stanby();
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

    get_user_detail(){
        this.common_service.get_user_from_storage()
            .then( user_details => {
                this.user_details = user_details;
            })
    }
    get_user_detail_on_stanby(){
        this.events.subscribe('user_update', ( user_details ) => {
            this.user_details = user_details;
        });
    }

    click_menu( type ){
        this.navCtrl.goRoot('/' + type);
        this.is_menu_active = type;
    }

    left_menu_action(){
        
        this.events.subscribe('side_menu', ( status ) => {
            switch( status ){
                case 'open':
                    this.is_side_menu_active = true;
                    break;
                case 'close':
                    this.is_side_menu_active = false;
                    break;
                case 'toggle':
                    this.is_side_menu_active = !this.is_side_menu_active;
                    break;
                default:
                    break;
            } 
        });
    }
}
