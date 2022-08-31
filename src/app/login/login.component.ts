import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Customer } from '../models/customer.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  btnLoading: boolean = false;

  customer: Customer = {
    id: '', username: '', firstName: '', lastName: '', avatar: '', email: '', phone: '', bio: '', gender: '',
    studio: false, price: 0, rate: 0, status: '', countries: [], voiceStyles: [], voiceDemos: []
  };

  constructor(private form: UntypedFormBuilder, private service: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  signInForm = this.form.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  async signIn() {
    if (this.signInForm.valid) {
      this.btnLoading = true;
      await this.service.signIn(this.signInForm.value).subscribe(result => {
        this.btnLoading = false;
        if (result.status == 200) {
          var user: User = JSON.parse(JSON.stringify(result.body));
          localStorage.setItem('USER', JSON.stringify(user));
          this.service.setUserGlobal(user);
          window.location.href = "/main/home";
          // this.router.navigate(['/main/home']);
        }
      }, error => {
        this.btnLoading = false;
        if (error.status == 401) {
          Swal.fire(
            'Xin lỗi!',
            'Tên đăng nhập hoặc mật khẩu không đúng!',
            'info'
          )
        }
      });
    }
  }

}
