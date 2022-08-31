import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { User } from 'src/app/models/user.model';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  customer: Customer = {
    id: '', username: '', firstName: '', lastName: '', avatar: '', email: '', phone: '', bio: '', gender: '',
    studio: false, price: 0, rate: 0, status: '', countries: [], voiceStyles: [], voiceDemos: []
  };

  loading: boolean = true;
  defaultAvatar: string = environment.defaultAvatar;
  balance: number = 0;
  result: Subscription;

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getCustomerGlobal().subscribe(result => {
      this.customer = result;
    })
    this.getBalance();
    this.getCustomerInfo();
  }

  getCustomerInfo() {
    this.loading = true;
    var data = localStorage.getItem('USER');
    if (data) {
      var user: User = JSON.parse(data);
      this.result = this.customerService.getCustomerInfo(user.id).subscribe(result => {
        this.customer = result.body!;
        this.customerService.setCustomerGlobal(this.customer);
        this.loading = false;
      })
    }
  }

  getBalance() {
    this.customerService.getBalanceGlobal().subscribe(result => {
      this.balance = result;
    })
    this.customerService.getBalance().subscribe(result => {
      var balance: number = result.body!;
      this.customerService.setBalanceGlobal(balance);
    })
  }

  signOut() {
    localStorage.removeItem("USER");
    this.router.navigate(['']);
  }
}
