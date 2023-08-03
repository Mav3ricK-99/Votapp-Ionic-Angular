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

  public votapps$: Observable<any>;

  public closedVotapps$: Observable<any>;
  public openedVotapps$: Observable<any>;

  public nowSeeing: string;

  constructor(private userService: UserService, private router: Router) {
    this.votapps$ = this.userService.getMyVotes();

    this.closedVotapps$ = this.votapps$.pipe(map((votaciones: any) => {
      let votacionesCerradas = votaciones.filter((votacion: Votacion) => votacion.isEnded() ? true : false);
      return (votacionesCerradas.length > 0) ? votacionesCerradas : [];
    }));

    this.openedVotapps$ = this.votapps$.pipe(map((votaciones: any) => {
      let votacionesAbiertas = votaciones.filter((votacion: Votacion) => !votacion.isEnded() ? true : false);
      return (votacionesAbiertas.length > 0) ? votacionesAbiertas : [];
    }));
  }

  ngOnInit() {
    this.nowSeeing = 'opened';
  }

  public showVotapps(state: string) {
    this.nowSeeing = state;
  }

  public goToVotapp(votapp: Votacion) {
    this.router.navigate([`mis-votapps/${votapp.id}`], {
      state: { votapp: votapp },
    });
  }
}
