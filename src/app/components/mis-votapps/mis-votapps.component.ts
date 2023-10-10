import { Component, OnInit, Optional } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Observable, filter, map } from 'rxjs';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent implements OnInit {

  public votaciones$: Observable<any>;

  constructor(private userService: UserService, private router: Router) {
    App.addListener('backButton', () => {
      App.minimizeApp();
    })
  }

  ngOnInit(): void {
    this.llamarVotapps();
  }

  public goToVotapp(votapp: Votacion) {
    this.router.navigate([`mis-votapps/${votapp.id}`]);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.llamarVotapps();
      event.target.complete();
    }, 500);
  }

  private llamarVotapps() {
    this.votaciones$ = this.userService.getMisVotos();
  }
}
