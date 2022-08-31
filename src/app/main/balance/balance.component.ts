import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { IsSubscription } from 'src/app/models/subscription.model';
import { User } from 'src/app/models/user.model';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  step: number = 0;

  artist: Customer = {
    id: '', username: '', firstName: '', lastName: '', avatar: '', email: '', phone: '', bio: '', gender: '',
    studio: false, price: 0, rate: 0, status: '', countries: [], voiceStyles: [], voiceDemos: []
  };

  defaultAvatar: string = environment.defaultAvatar;

  balance: number = 0;

  loading: boolean = false;

  subscription: IsSubscription = {
    isSubscription: false,
    subscriptionExpired: ''
  };

  constructor(private service: CustomerService) { }

  ngOnInit(): void {
    this.getArtistInfo();
    this.getBalance();
    this.getSubscription();
  }

  getArtistInfo() {
    this.service.getCustomerGlobal().subscribe(result => {
      this.artist = result;
    })
    var data = localStorage.getItem('USER');
    if (data) {
      var user: User = JSON.parse(data);
      this.service.getCustomerInfo(user.id).subscribe(result => {
        if (result.body !== null) {
          this.service.setCustomerGlobal(result.body);
        }
      }, error => {
        console.log(error);
      })
    }
  }

  getBalance() {
    this.service.getBalanceGlobal().subscribe(result => {
      this.balance = result
    })
    this.service.getBalance().subscribe(result => {
      var balance: number = result.body!;
      this.service.setBalanceGlobal(balance);
    })
  }

  getSubscription() {
    this.service.getSubscription().subscribe(result => {
      if (result.body) {
        this.subscription = result.body as IsSubscription;
        this.loading = true;
      }
    })
  }

}
