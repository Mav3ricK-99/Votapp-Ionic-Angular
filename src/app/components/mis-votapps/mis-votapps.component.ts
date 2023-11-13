import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, merge } from 'rxjs';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { App } from '@capacitor/app';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonRouterOutlet, Platform } from '@ionic/angular';
@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent {

  @ViewChild('infiniteScrollAbiertas') infiniteScrollAbiertas: IonInfiniteScroll;
  @ViewChild('infiniteScrollCerradas') infiniteScrollCerradas: IonInfiniteScroll;
  public votacionesAbiertas: Votacion[] = [];
  public votacionesCerradas: Votacion[] = [];
  public pagina: number;
  public votacionesListas: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.pagina = 0;
    this.votacionesListas = false;
  }

  ionViewDidEnter() {
    this.llamarVotapps(this.pagina);
  }

  public goToVotapp(votapp: Votacion) {
    this.router.navigate([`mis-votapps/${votapp.id}`]);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.pagina = 0;
      this.llamarVotapps(this.pagina);
      event.target.complete();
    }, 500);
  }

  onIonInfinite(ev: any) {
    setTimeout(() => {
      this.pagina++;
      this.llamarVotapps(this.pagina);
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 750);
  }

  private llamarVotapps(pagina: number) {
    let votacionesAbiertas = 0;
    let votacionesCerradas = 0;
    this.userService.getMisVotos(pagina).subscribe((votaciones: Votacion[]) => {
      if (!pagina) {
        this.votacionesCerradas = [];
        this.votacionesAbiertas = [];
      }
      votaciones.forEach((votacion: Votacion) => {
        if (votacion.estaFinalizada()) {
          votacionesCerradas += 1;
          this.votacionesCerradas.push(votacion)
        } else {
          this.votacionesAbiertas.push(votacion)
          votacionesAbiertas += 1;
        }
      });
      this.votacionesListas = true;

      if (votaciones.length < 10) {
        this.infiniteScrollAbiertas.disabled = true;
        this.infiniteScrollCerradas.disabled = true;
      }
      if (!votacionesAbiertas && this.infiniteScrollAbiertas) {
        this.infiniteScrollAbiertas.disabled = true;
      }
      if (!votacionesCerradas && this.infiniteScrollCerradas) {
        this.infiniteScrollCerradas.disabled = true;
      }
      //SI justo hay 10 mas quedaria el front bugeado (un poco, se podrian recargar mas)
    });
  }
}
