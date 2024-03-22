import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonMenu, IonMenuButton, IonHeader, IonButtons, IonTitle, IonContent, IonToolbar, IonMenuToggle, MatIconModule, RouterLink]
})
export class MenuComponent {

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  constructor() { }

  cerrarSesion() {
    this.userService.cerrarSesion();
    this.router.navigateByUrl('auth/login');
  }
}

