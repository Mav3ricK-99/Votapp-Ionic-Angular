import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent implements OnInit {

  public mostrarVista: boolean = false;

  public votappsAbiertas: Votacion[] = [];
  public votappsCerradas: Votacion[] = [];

  public ahoraViendo: string;

  constructor(private userService: UserService, private router: Router) {
    this.llamarVotapps();
  }

  ngOnInit() {
    this.ahoraViendo = 'abiertas';
  }

  public mostrarVotapps(estado: string) {
    this.ahoraViendo = estado;
  }

  public goToVotapp(votapp: Votacion) {
    this.router.navigate([`mis-votapps/${votapp.id}`]);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.mostrarVista = false;
      this.llamarVotapps();
      event.target.complete();
    }, 500);
  }

  private llamarVotapps() {
    this.userService.getMyVotes().subscribe({
      next: (votaciones: Votacion[]) => {
        this.mostrarVista = true;
        votaciones.forEach((votapp: Votacion) => {
          if (!votapp.estaFinalizada()) {
            this.votappsAbiertas.push(votapp);
          } else {
            this.votappsCerradas.push(votapp);
          }
        })
      }
    });
  }
}
