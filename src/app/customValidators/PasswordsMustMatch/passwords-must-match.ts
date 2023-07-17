import { AbstractControl, ValidationErrors } from '@angular/forms';
export function passwordsMustMatch(form: AbstractControl): ValidationErrors | null {
    let password = form.get('password');
    let repeatPassword = form.get('repeatPassword');
    if (password?.value != repeatPassword?.value) {
        repeatPassword?.setErrors({
            passwordsMustMatch: true,
        });
        return {
            passwordsMustMatch: true,
        }
    }
    return null;
}