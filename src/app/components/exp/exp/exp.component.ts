import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.component.html',
  styleUrls: ['./exp.component.scss'],
})
export class ExpComponent implements OnInit {

  private readonly elementRef = inject(ElementRef);

  constructor(private route: Router) { }

  ngOnInit() { }

  navigateBack() {
    this.elementRef.nativeElement.classList.add('full-page-transition')
    void this.route.navigateByUrl('/mis-votapps');
  }

}
