import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent implements OnInit{

  public mostrarVista: boolean = false;

  public comunidades$: Observable<any>;

  constructor(private userService: UserService, private router: Router, private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if((this.routerOutlet && !this.routerOutlet.canGoBack()) && this.userService.hayUsuarioIngresado()) { //Solo si esta logueado!
        App.minimizeApp();
      }
    });
  }

  ngOnInit(): void {
    this.llamarVotapps();
  }

  public goToVotapp(votapp: Votacion) {
    this.router.navigate([`mis-votapps/${votapp.id}`]);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.mostrarVista = false;
      this.llamarVotapps();
      event.target.complete();
    }, 500);
  }

  private llamarVotapps() {
    this.comunidades$ = this.userService.getMisVotos();
    this.mostrarVista = true;
  }
}
