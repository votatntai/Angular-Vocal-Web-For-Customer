import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'src/app/models/subscription.model';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  subscriptions: Subscription[];

  loading: boolean = false;

  constructor(private service: CustomerService, private curency: CurrencyPipe) { }

  ngOnInit(): void {
    this.getAllSubscription();
  }

  subscriptionOnSubmit(day: number, title: string, amount: number) {
    Swal.fire({
      title: 'Bạn có chắn chắn',
      text: "Mua " + title + " với giá " + this.curency.transform(amount, 'VND'),
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#212529',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = false;
        this.service.registerSubscription(day).subscribe(result => {
          this.service.getBalance().subscribe(result => {
            this.service.setBalanceGlobal(result.body as number);
            this.loading = true;
            Swal.fire(
              'Thành công!',
              'Hoàn tất thanh toán',
              'success'
            )
          });
        })
      }
    })

  }

  getAllSubscription() {
    this.service.getAllSubscription().subscribe(result => {
      if (result) {
        var response: any = result.body;
        this.subscriptions = response['data'] as Subscription[]
        this.loading = true;
      }
    })
  }

}
