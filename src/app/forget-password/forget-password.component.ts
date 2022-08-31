import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PasswordConfirmedValidator } from '../validators/validator';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  constructor(private form: FormBuilder, private authService: AuthService, private router: Router) { }

  isSent: boolean = false;

  ngOnInit(): void {
  }

  forgetPasswordForm = this.form.group({
    email: ['benny20001456@gmail.com', [Validators.required, Validators.email]],
  });

  verifyPasswordForm = this.form.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', Validators.required],
    rePassword: ['', Validators.required]
  }, {
    validator: PasswordConfirmedValidator('newPassword', 'rePassword')
  });

  forgetPassword() {
    if (this.forgetPasswordForm.valid) {
      this.authService.forgetPassword(this.forgetPasswordForm.value['email']!).subscribe(result => {
        if (result.status == 200) {
          this.isSent = true;
        } else {
          console.warn(result);
        }
      }, error => {
        console.log(error);
        if (error.status == 400) {
          console.warn(error);
        }
      })
    }
  }

  verifyPassword() {
    if (this.verifyPasswordForm.valid) {
      var body = {
        email: this.forgetPasswordForm.value['email'],
        otp: this.verifyPasswordForm.value['otp'],
        newPassword: this.verifyPasswordForm.value['newPassword']
      }
      this.authService.verifyPassword(body).subscribe(result => {
        if (result.status == 200) {
          this.router.navigate(['']);
        }
      })
    }
  }


}
