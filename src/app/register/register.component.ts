import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { PasswordConfirmedValidator } from '../validators/validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  constructor(private service: AuthService, private form: FormBuilder) { }

  ngOnInit(): void {
  }

  registerForm = this.form.group({
    username: ['votantai4899', Validators.required],
    firstName: ['Võ', Validators.required],
    lastName: ['Tấn Tài', Validators.required],
    email: ['votantai4899@gmail.com', Validators.email],
    gender: ['Nam', Validators.required],
    phone: ['0339040899', [Validators.required, Validators.pattern('(03|05|07|08|09)[0-9]{8}')]],
    password: ['tantai4899', [Validators.required, Validators.minLength(6)]],
    rePassword: ['tantai4899', [Validators.required, Validators.minLength(6)]],
    conditions: ['', Validators.requiredTrue],
  }, {
    validator: PasswordConfirmedValidator('password', 'rePassword')
  });

  register() {
    if (this.registerForm.valid) {
      var customer: any = {
        username: this.registerForm.value['username'],
        email: this.registerForm.value['email'],
        phone: this.registerForm.value['phone'],
        password: this.registerForm.value['password'],
        firstName: this.registerForm.value['firstName'],
        lastName: this.registerForm.value['lastName'],
        gender: this.registerForm.value['gender']
      }
      this.service.signUp(customer).subscribe(result => {
        if (result.status == 201) {
          this.registerForm.reset();
          Swal.fire(
            'Thành công!',
            'Bạn đã đăng ký tài khoản thành công!',
            'success'
          )
        }
      }, error => {
        Swal.fire(
          'Lỗi!',
          error.error.data,
          'warning'
        )
      });
    }
  }
}
