import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-password-reset-token',
  templateUrl: './password-reset-token.component.html',
  styleUrls: ['./password-reset-token.component.scss'],
})
export class PasswordResetTokenComponent {

  public passwordResetTokenForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private _bottomSheet: MatBottomSheet, private router: Router) {
    this.passwordResetTokenForm = formBuilder.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.max(60)], updateOn: 'blur' }),
    });
  }

  submitPasswordResetRequest() {
    if (!this.passwordResetTokenForm.valid) return;

    let email = this.passwordResetTokenForm.get('email')?.value;

    this.authService.retrievePasswordResetToken(email).subscribe({
      next: (obj: any) => {
        this._bottomSheet.open(PasswordResetTokenBottomSheet);
        setTimeout(() => {
          this._bottomSheet.dismiss(PasswordResetTokenBottomSheet);
          this.router.navigate([`/auth/reset-password`], {
            state: { email: email },
          });
        }, 6000);
      },
      error: err => {
        console.log(err);
      }
    });
  }

}

@Component({
  selector: 'app-password-reset-token-bottom-sheet',
  templateUrl: './password-reset-token-bottom-sheet.component.html',
})
export class PasswordResetTokenBottomSheet {
  constructor(private _bottomSheetRef: MatBottomSheetRef<PasswordResetTokenBottomSheet>) { }
}