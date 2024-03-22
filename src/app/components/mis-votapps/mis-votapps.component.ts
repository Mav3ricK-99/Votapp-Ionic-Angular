import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { InfiniteScrollCustomEvent, IonInfiniteScroll as IonInfiniteScrollAngular } from '@ionic/angular';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonMenuButton, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VotappCardComponent } from '../votapps/votapp-card/votapp-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BotonesInicioComponent } from '../util/botones-inicio/botones-inicio.component';

@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonButtons, IonMenuButton, IonRefresherContent, IonRefresher, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonCol, IonGrid, IonTitle, MatIconModule, MatTabsModule, MatRippleModule, MatCardModule, RouterLink, UpperCasePipe, MatButtonModule, TranslateModule, NgClass, VotappCardComponent, BotonesInicioComponent]
})
export class MisVotappsComponent implements OnInit {

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  @Input('enLibro') enLibro: boolean;

  @ViewChild('infiniteScrollAbiertas') infiniteScrollAbiertas: IonInfiniteScrollAngular;
  @ViewChild('infiniteScrollCerradas') infiniteScrollCerradas: IonInfiniteScrollAngular;
  public votacionesAbiertas: Votacion[] = [];
  public votacionesCerradas: Votacion[] = [];
  public votaciones: Votacion[] = [];
  public pagina: number;
  public votacionesListas: boolean;

  constructor() {
    this.pagina = 0;
    this.votacionesListas = false;
  }

  ngOnInit() {
    this.votaciones = [];
    this.llamarVotapps(this.pagina);
  }

  public goToVotapp(votapp: Votacion) {
    if (!this.enLibro) {
      this.router.navigate([`mis-votapps/${votapp.id}`]);
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.pagina = 0;
      this.votaciones = [];
      this.llamarVotapps(this.pagina);
      event.target.complete();
    }, 500);
  }

  onIonInfinite(ev: any) {
    setTimeout(() => {
      this.pagina++;
      this.llamarVotapps(this.pagina);
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1850);
  }

  private filtrarVotacionesPorComunidad(nombreComunidad: string) {
    this.votacionesAbiertas = this.votaciones.filter((votacion: Votacion) => {
      if (!votacion.estaFinalizada() && (votacion.comunidad.nombre.toLocaleLowerCase().includes(nombreComunidad) || nombreComunidad == '')) {
        return true;
      } else {
        return false;
      }
    });
    this.votacionesCerradas = this.votaciones.filter((votacion: Votacion) => {
      if (votacion.estaFinalizada() && (votacion.comunidad.nombre.toLocaleLowerCase().includes(nombreComunidad) || nombreComunidad == '')) {
        return true;
      } else {
        return false;
      }
    });
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
        this.votaciones.push(votacion);
        if (votacion.estaFinalizada()) {
          votacionesCerradas += 1;
          this.votacionesCerradas.push(votacion)
        } else {
          this.votacionesAbiertas.push(votacion)
          votacionesAbiertas += 1;
        }
      });
      this.votacionesListas = true;

      if (this.infiniteScrollAbiertas && this.infiniteScrollCerradas) {
        if (votaciones.length < 10) {
          this.infiniteScrollAbiertas.disabled = true;
          this.infiniteScrollCerradas.disabled = true;
        }
        if (!votacionesAbiertas) {
          this.infiniteScrollAbiertas.disabled = true;
        }
        if (!votacionesCerradas) {
          this.infiniteScrollCerradas.disabled = true;
        }
      }
      //SI justo hay 10 mas quedaria el front bugeado (un poco, se podrian recargar mas)
    });
  }
}
