import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-votapp-card',
  templateUrl: './votapp-card.component.html',
  styleUrls: ['./votapp-card.component.scss'],
})
export class VotappCardComponent implements OnInit {

  @Input('votapp') votapp: any;

  constructor() { }

  ngOnInit() {
  }

}
