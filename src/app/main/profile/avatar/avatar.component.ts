import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';
import { Customer } from 'src/app/models/customer.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  btnLoading: boolean = false;

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  private fileToUpload: FormData;

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
    if (e.base64) {
      var avatar: FormData = new FormData();
      avatar.append('avt', base64ToFile(e.base64), 'avt.png');
      this.fileToUpload = avatar;
    }
  }

  imgLoad() {
    // display cropper tool
  }

  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  public constructor(private service: CustomerService) {
  }

  user: User;

  customer: Customer;

  public ngOnInit(): void {
    this.getUserInfo();
    this.service.getCustomerGlobal().subscribe(result => {
      this.customer = result;
    })
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

  updateAvatar() {
    if (this.fileToUpload) {
      this.btnLoading = true;
      this.service.updateAvatar(this.fileToUpload).subscribe(result => {
      }, error => {
        if (error.status == 200) {
          Swal.fire(
            'Thành công!',
            'Bạn đã đổi ảnh đại diện thành công!',
            'success'
          ).then(result => {
            this.service.getCustomerInfo(this.user.id).subscribe(result => {
              var customer: Customer = result.body!;
              this.service.setCustomerGlobal(customer);
            });
          })
          this.btnLoading = false;
        }
      })
    } else {
      console.warn('File not found!')
    }
  }

}
