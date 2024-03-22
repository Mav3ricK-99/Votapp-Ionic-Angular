import { UpperCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { IonButtons, IonCol, IonContent, IonHeader, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MisVotappsComponent } from '../mis-votapps/mis-votapps.component';
import { UserService } from 'src/app/services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonRow, IonCol, IonContent, IonTitle, IonButtons, IonMenuButton, UpperCasePipe, TranslateModule, MisVotappsComponent, RouterLink]
})
export class InicioComponent implements OnInit {

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  public abriendoLibro: boolean;

  @ViewChild('tapaIzquierda') tapaIzquierda: ElementRef;
  @ViewChild('centroLibro') centroLibro: ElementRef;
  @ViewChild('primerPagina') primerPagina: ElementRef;
  @ViewChild('bookWrap') bookWrap: ElementRef;
  @ViewChild('escena') escena: ElementRef;
  @ViewChild('pageText') pageText: ElementRef;
  @ViewChild('derechaLibro') derechaLibro: ElementRef;
  @ViewChild('tapaDerecha') tapaDerecha: ElementRef;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.abrirLibro();
    }, 1500);
  }

  abrirLibro() {
    if (!this.abriendoLibro) {
      this.abriendoLibro = true;
      this.bookWrap.nativeElement.style.left = '50px';

      this.animacionLibro().then(() => {
        setTimeout(() => {
          this.router.navigateByUrl('mis-votapps');
        }, 3500);
      })
    }
  }

  animacionLibro() {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        this.tapaIzquierda.nativeElement.style.transform = 'translate3d(10%, 10px, 106px) rotateX(0deg) rotateY(-150deg) rotateZ(0deg)';
        this.centroLibro.nativeElement.style.transform = 'translate3d(5px, 8px, -150px) rotateX(-4deg) rotateY(0deg) rotateZ(0deg)';
        this.centroLibro.nativeElement.style.height = '114%';
        this.primerPagina.nativeElement.style.transform = 'translate3d(12px, 5px, 75px) rotateX(0deg) rotateY(32deg) rotateZ(0deg)';
        this.derechaLibro.nativeElement.style.transform = 'translate3d(0px, 0px, 0px)';
        this.bookWrap.nativeElement.style.left = '0px';
        this.tapaDerecha.nativeElement.style.transform = 'translate3d(0%, 11px, 59px)';
        this.pageText.nativeElement.style.transform = 'translate3d(29vw, 0px, 10px)';
      }, 2000);
      resolve();
    });
  }

}
