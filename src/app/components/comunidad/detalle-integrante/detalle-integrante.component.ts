import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailParticipacion } from '../nueva-comunidad/nueva-comunidad.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-integrante',
  templateUrl: './detalle-integrante.component.html',
  styleUrls: ['./detalle-integrante.component.scss'],
  animations: [
    trigger('toggleDetalle', [
      transition(":enter", [
        animate("550ms ease-in-out", keyframes([
          style({ left: '400px' }),
          style({ left: '-15px' }),
          style({ left: '0px' }),
        ])),
      ]),
      transition(":leave", [
        animate("550ms ease-in-out", keyframes([
          style({ left: '-15px' }),
          style({ left: '400px' }),
        ])),
      ]),
    ]),
  ],
  standalone: true, 
  imports: [TranslateModule, MatCardModule, MatIconModule, MatButtonModule]
})
export class DetalleIntegranteComponent implements OnInit {
  //Ver esto  ? https://angular.io/api/animations/stagger

  @Input('integrante') integrante: EmailParticipacion

  @Output() editarIntegranteEvent = new EventEmitter<EmailParticipacion>();
  @Output() eliminarIntegranteEvent = new EventEmitter<EmailParticipacion>();

  public mostrar: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  editarIntegrante() {
    this.editarIntegranteEvent.emit(this.integrante);
  }

  eliminarIntegrante() {
    this.mostrar = false;
    setTimeout(() => {
      this.eliminarIntegranteEvent.emit(this.integrante);
    }, 700)
  }

}
