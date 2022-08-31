import { UntypedFormGroup } from '@angular/forms';

export function PasswordConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function StartDeadlineValidator(startDate: string) {
    return (formGroup: UntypedFormGroup) => {
        const startDateControl = formGroup.controls[startDate];

        const start = new Date(formGroup.controls[startDate].value);

        const current = new Date();
        if (startDateControl.errors) {
            return;
        }
        if (start.getTime() >= current.getTime()) {
            startDateControl.setErrors(null);
        }
        else {
            startDateControl.setErrors({ invalid: true });
        }
    }
}

export function EndDeadlineValidator(startDate: string, endDate: string) {
    return (formGroup: UntypedFormGroup) => {
        const endDateControl = formGroup.controls[endDate];

        const end = new Date(formGroup.controls[endDate].value);
        const start = new Date(formGroup.controls[startDate].value);

        const current = new Date();
        if (endDateControl.errors) {
            return;
        }
        if (start) {
            if (end.getTime() >= current.getTime() && end.getTime() > start.getTime()) {
                endDateControl.setErrors(null);
            }
            else {
                endDateControl.setErrors({ invalid: true });
            }
        }
    }
}