import { UpperCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { IonButtons, IonCol, IonContent, IonHeader, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MisVotappsComponent } from '../mis-votapps/mis-votapps.component';
import { UserService } from 'src/app/services/user/user.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { animate, animation, state, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonRow, IonCol, IonContent, IonTitle, IonButtons, IonMenuButton, UpperCasePipe, TranslateModule, MisVotappsComponent, RouterLink],
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
      this.abrirPortada();
      this.irMisVotapps();
    }, 1500);
  }

  toggleClass(e: any, toggleClassName: any) {
    if (e.className.includes(toggleClassName)) {
      e.className = e.className.replace(' ' + toggleClassName, '');
    } else {
      e.className += ' ' + toggleClassName;
    }
  }

  abrirPortada() {
    let e: any = document.getElementById('primer');
    this.toggleClass(e, "left-side");
    this.toggleClass(e.nextElementSibling, "left-side");
  }

  irMisVotapps() {
    if (!this.abriendoLibro) {
      this.abriendoLibro = true;
      setTimeout(() => {
        this.router.navigateByUrl('dashboard/mis-votapps');
      }, 700);
    }
  }
}
