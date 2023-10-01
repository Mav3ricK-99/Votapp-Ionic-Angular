import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent implements OnInit {

  public titulo: string;
  public mensaje: string;

  constructor(@Inject(MAT_DIALOG_DATA) public datos: any) {
  }

  ngOnInit() {
    this.titulo = this.datos.titulo;
    this.mensaje = this.datos.mensaje;
  }

}
