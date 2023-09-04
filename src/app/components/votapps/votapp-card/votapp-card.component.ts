import { Component, Input, OnInit } from '@angular/core';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-votapp-card',
  templateUrl: './votapp-card.component.html',
  styleUrls: ['./votapp-card.component.scss'],
})
export class VotappCardComponent {

  @Input('votapp') votapp: Votacion;

  constructor(public userService: UserService) { }

}
