import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline, logOutOutline, readerOutline, storefrontOutline } from 'ionicons/icons';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, RouterLink, MatIcon]
})
export class DashboardComponent {

  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  constructor() {
    addIcons({ 'book-outline': bookOutline, 'reader-outline': readerOutline, 'log-out-outline': logOutOutline });
  }

  cerrarSesion() {
    this.userService.cerrarSesion();
    this.router.navigateByUrl('auth/login');
  }

}
