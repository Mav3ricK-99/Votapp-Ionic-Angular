import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, MenuController } from '@ionic/angular';
import { debounce, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent implements AfterViewInit {

  @ViewChild('infiniteScrollAbiertas') infiniteScrollAbiertas: IonInfiniteScroll;
  @ViewChild('infiniteScrollCerradas') infiniteScrollCerradas: IonInfiniteScroll;
  @ViewChild('inputBusqueda') inputBusqueda: ElementRef;
  public votacionesAbiertas: Votacion[] = [];
  public votacionesCerradas: Votacion[] = [];
  public votaciones: Votacion[] = [];
  public pagina: number;
  public votacionesListas: boolean;

  constructor(private userService: UserService, private router: Router, private menuCtrl: MenuController) {
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
    }, 1850);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      fromEvent(this.inputBusqueda.nativeElement, 'input')
        .pipe(map((event: any) => (event.target as HTMLInputElement).value))
        .pipe(debounceTime(1500))
        .pipe(distinctUntilChanged())
        .subscribe(data => {
          this.filtrarVotacionesPorComunidad(data.toLocaleLowerCase());
        });
    }, 750);
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
