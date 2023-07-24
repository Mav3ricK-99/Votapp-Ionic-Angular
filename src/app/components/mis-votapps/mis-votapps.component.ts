import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-mis-votapps',
  templateUrl: './mis-votapps.component.html',
  styleUrls: ['./mis-votapps.component.scss'],
})
export class MisVotappsComponent implements OnInit {

  public votapps$: Observable<any>;

  constructor(private userService: UserService) {
    this.votapps$ = this.userService.getMyVotes();
  }

  ngOnInit() { }

}
