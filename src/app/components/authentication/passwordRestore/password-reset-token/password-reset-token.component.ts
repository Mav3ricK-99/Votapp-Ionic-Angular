import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-password-reset-token',
  templateUrl: './password-reset-token.component.html',
  styleUrls: ['./password-reset-token.component.scss'],
})
export class PasswordResetTokenComponent {

  public recuperoContraseniaForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, public dialog: MatDialog, private router: Router) {
    this.recuperoContraseniaForm = formBuilder.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.max(60)], updateOn: 'blur' }),
    });
  }

  enviarEmailRecuperoContrasenia() {
    if (!this.recuperoContraseniaForm.valid) return;

    this.dialog.open(EnviandoEmailRecuperoDialog, { maxWidth: '90vw' });
    let email = this.recuperoContraseniaForm.get('email')?.value;

    this.authService.solicitarTokenRecuperoContrasenia(email).subscribe({
      next: (obj: any) => {
        this.dialog.closeAll();
        this.dialog.open(EmailEnviadoDialog, { maxWidth: '90vw' }).afterClosed().subscribe(() => {
          this.router.navigate([`/auth/reset-password`], {
            state: { email: email },
          });
        });
      },
      error: err => {
        this.dialog.closeAll();
        console.log(err);
      }
    });
  }

}

@Component({
  selector: 'app-enviando-email-recupero-dialog-component',
  templateUrl: './enviando-email-recupero-dialog.component.html',
  styleUrls: ['./enviando-email-recupero-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
})
export class EnviandoEmailRecuperoDialog {

  constructor(public dialogRef: MatDialogRef<EnviandoEmailRecuperoDialog>) { }

}
@Component({
  selector: 'app-email-enviado-dialog-component',
  templateUrl: './email-enviado-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class EmailEnviadoDialog {

  constructor(public dialogRef: MatDialogRef<EmailEnviadoDialog>) { }

}