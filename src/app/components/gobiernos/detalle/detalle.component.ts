import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonContent, IonGrid, IonRow, IonCol, MatIconButton, MatButton, MatIcon, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardActions, MatMenu, MatMenuTrigger, MatMenuItem, MatChipsModule, MatDividerModule, MatButtonToggleModule, RouterLink]

})
export class DetalleComponent implements OnInit {

  private router: Router = inject(Router);
  
  private dialog: MatDialog = inject(MatDialog);

  constructor() { }

  ngOnInit() { }

  public abrirDialog() {
    this.dialog.open(ConfirmarAbandonarComunidadDialog, { maxWidth: '90vw' })
      .afterClosed();
  }

}

@Component({
  selector: 'confirmar-abandonar-comunidad-dialog',
  templateUrl: 'confirmar-abandonar-comunidad-dialog.html',
  styleUrls: ['./confirmar-abandonar-comunidad-dialog.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmarAbandonarComunidadDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmarAbandonarComunidadDialog>) { }

  public confirm(): void {
    this.dialogRef.close(true);
  };

  public cancel(): void {
    this.dialogRef.close(false);
  };
}