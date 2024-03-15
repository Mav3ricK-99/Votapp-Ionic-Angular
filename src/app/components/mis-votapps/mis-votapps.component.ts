import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { InfiniteScrollCustomEvent, IonInfiniteScroll } from '@ionic/angular';
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
  public votaciones: Votacion[] = [];
  public pagina: number;
  public votacionesListas: boolean;
  public fullscreen: boolean;

  @ViewChild('tapaIzquierda') tapaIzquierda: ElementRef;
  @ViewChild('centroLibro') centroLibro: ElementRef;
  @ViewChild('primerPagina') primerPagina: ElementRef;
  @ViewChild('bookWrap') bookWrap: ElementRef;
  @ViewChild('escena') escena: ElementRef;
  @ViewChild('pageText') pageText: ElementRef;
  @ViewChild('derechaLibro') derechaLibro: ElementRef;
  @ViewChild('tapaDerecha') tapaDerecha: ElementRef;

  constructor(private userService: UserService, private router: Router) {
    this.pagina = 0;
    this.votacionesListas = false;
  }

  ionViewDidEnter() {
    this.votaciones = [];
    this.llamarVotapps(this.pagina);
  }

  public goToVotapp(votapp: Votacion) { //Esto va en el componente del card
    console.log("XD");
    if (this.fullscreen) {
      this.router.navigate([`mis-votapps/${votapp.id}`]);
    }
  }

  abrirLibro() {
    this.bookWrap.nativeElement.style.left = '50px';

    setTimeout(() => {
      this.tapaIzquierda.nativeElement.style.transform = 'translate3d(10%, 10px, 80px) rotateX(0deg) rotateY(-150deg) rotateZ(0deg)';
      this.centroLibro.nativeElement.style.transform = 'translate3d(5px, 11px, -150px) rotateX(-4deg) rotateY(0deg) rotateZ(0deg)';
      this.centroLibro.nativeElement.style.height = '111%';
      this.primerPagina.nativeElement.style.transform = 'translate3d(12px, 5px, 55px) rotateX(0deg) rotateY(32deg) rotateZ(0deg)';
      this.derechaLibro.nativeElement.style.transform = 'translate3d(130px, 0px, 0px)';
      this.bookWrap.nativeElement.style.left = '0px';
      this.tapaDerecha.nativeElement.style.transform = 'translate3d(-61%, 10px, 30px)';
    }, 1000);
  }

  goFullscreen(e: Event) {
    /*  const {
       top,
       left,
     } = this.pageText.nativeElement.getBoundingClientRect()
     console.log(this.pageText.nativeElement.getBoundingClientRect());
     // Clone the element and its children
     this.pageText.nativeElement.style.transform = 'none';
     let fullScreen = this.pageText.nativeElement.cloneNode(true)
 
     // Set top and left with custom property
     fullScreen.style.setProperty("--inset", `${top}px auto auto ${left}px`)
 
     // Add class with animation and position
     fullScreen.classList.add("full-screen")
 
     // Place in container over element to expand
     this.escena.nativeElement.appendChild(fullScreen)
 
     document.querySelectorAll('mat-card').forEach((el: Element) => {
       el.classList.add('fullscreen')
     })
     this.fullscreen = true; */
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
