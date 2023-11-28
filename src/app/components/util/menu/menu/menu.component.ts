import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  constructor(private userService: UserService, private router: Router) { }

  cerrarSesion() {
    this.userService.cerrarSesion();
    this.router.navigateByUrl('auth/login');
  }
}

