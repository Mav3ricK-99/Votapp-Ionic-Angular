import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-procesando-dialog',
  templateUrl: './procesando-dialog.component.html',
  styleUrls: ['./procesando-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatProgressBarModule]
})
export class ProcesandoDialogComponent  implements OnInit {

  public titulo: string;
  public mensaje: string;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: any) {
  }

  ngOnInit() {
    this.titulo = this.datos.titulo;
    this.mensaje = this.datos.mensaje;
  }

}
