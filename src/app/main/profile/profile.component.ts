import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/customer.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PasswordConfirmedValidator } from 'src/app/validators/validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private service: AuthService,
    private customerService: CustomerService,
    private form: UntypedFormBuilder,
  ) { }

  btnPasswordLoading: boolean = false;
  btnInfoLoading: boolean = false;

  user: User;

  customer: Customer;

  defaultAvatar: string = environment.defaultAvatar;

  rate: number;

  loading: boolean = false;

  updateProfileForm = this.form.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    // bio: ['', [Validators.required, Validators.minLength(50)]],
    // studio: [false, Validators.required],
    gender: ['', Validators.required],
    // phone: ['', [Validators.required, Validators.pattern('(03|05|07|08|09)[0-9]{8}')]]
  });

  updatePasswordForm = this.form.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {
    validator: PasswordConfirmedValidator('newPassword', 'rePassword')
  });

  ngOnInit(): void {
    this.customerService.getCustomerGlobal().subscribe(result => {
      this.customer = result;
    })
    this.getUserInfo();
    this.getCustomerInfo();
  }

  getUserInfo() {
    var data = localStorage.getItem('USER');
    if (data) {
      this.user = JSON.parse(data);
      if (this.user.avatar == '') {
        this.customer.avatar = environment.defaultAvatar;
      }
    }
  }

  getCustomerInfo() {
    this.loading = false;
    this.customerService.getCustomerInfo(this.user.id).subscribe(result => {
      if (result.body) {
        this.customer = result.body;
        this.customerService.setCustomerGlobal(this.customer);
        this.updateProfileForm.setValue({
          firstName: this.customer.firstName,
          lastName: this.customer.lastName,
          // bio: this.customer.bio,
          // studio: this.customer.studio,
          gender: this.customer.gender,
          // phone: this.artist.phone
        });
        this.rate = Math.floor(this.customer.rate);
        this.loading = true;
      }
    });
  }

  updateProfile() {
    if (this.updateProfileForm.valid) {
      this.btnInfoLoading = true;
      this.customerService.updateCustomerInfo(this.updateProfileForm.value).subscribe(result => {
        if (result.status == 200) {
          this.btnInfoLoading = false;
          this.customerService.setCustomerGlobal(result.body);
          Swal.fire(
            'Th??nh c??ng!',
            'Th??ng tin ng?????i d??ng ???? ???????c c???p nh???t!',
            'success'
          )
        }
      }, error => {
        console.log(error);
      })
    }
  }

  updatePassword() {
    var currentPassword = this.updatePasswordForm.value['currentPassword'];
    var newPassword = this.updatePasswordForm.value['newPassword'];
    var rePassword = this.updatePasswordForm.value['rePassword'];
    if (this.updatePasswordForm.valid) {
      if (newPassword != rePassword) {
        Swal.fire(
          'Th??? l???i!',
          'M???t kh???u m???i v?? m???t kh???u x??c nh???n kh??ng gi???ng nhau!',
          'info'
        )
      } else if (currentPassword == newPassword) {
        Swal.fire(
          'Xin l???i!',
          'M???t kh???u m???i kh??ng ???????c tr??ng v???i m???t kh???u c??!',
          'info'
        )
      } else {
        this.btnPasswordLoading = true;
        this.service.changePassword(this.user.email, newPassword, currentPassword).subscribe(result => {
          if (result.status == 200) {
            this.btnPasswordLoading = false;
            this.updatePasswordForm.reset();
            Swal.fire(
              'Th??nh c??ng!',
              'M???t kh???u c???a b???n ???? ???????c thay ?????i!',
              'success'
            )
          } else {
            this.btnPasswordLoading = false;
            Swal.fire(
              'L???i!',
              '???? c?? l???i x???y ra, vui l??ng li??n h??? b??? ph???n h??? tr???!',
              'error'
            )
          }
        }, error => {
          this.btnPasswordLoading = false;
          if (error.error['data'] == 'OLD_PASSWORD_INVALID') {
            Swal.fire(
              'Xin l???i!',
              'M???t kh???u hi???n t???i kh??ng ????ng!',
              'warning'
            )
          }
        });
      }
    }
  }

}
