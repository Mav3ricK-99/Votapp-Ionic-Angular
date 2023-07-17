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
      email: new FormControl('federico_99@live.com.ar', { validators: [Validators.required, Validators.email, Validators.max(60)], updateOn: 'blur' }),
      //password: new FormControl('votapp9090..', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
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
          this.router.navigate(
            ['/auth/reset-password'],
            { queryParams: { email: email } }
          );
        }, 2000);
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