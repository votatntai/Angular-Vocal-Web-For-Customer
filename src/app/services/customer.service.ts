import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';
import { IsSubscription } from '../models/subscription.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private baseUrl = environment.baseUrl;

    private customer: Customer = {
        id: '', username: '', firstName: '', lastName: '', avatar: '', email: '', phone: '', bio: '', gender: '',
        studio: false, price: 0, rate: 0, status: '', countries: [], voiceStyles: [], voiceDemos: []
    };

    balance: number = 0;

    private customerGlobal = new BehaviorSubject(this.customer);
    private balanceGlobal = new BehaviorSubject(this.balance);

    private httpHeaders: HttpHeaders;

    constructor(private http: HttpClient) {
        this.httpHeaders = this.getHttpHeaders();
    }

    public getBalanceGlobal(): Observable<number> {
        return this.balanceGlobal.asObservable();
    }

    public setBalanceGlobal(balance: number): void {
        this.balanceGlobal.next(balance);
    }

    public getCustomerGlobal(): Observable<Customer> {
        return this.customerGlobal.asObservable();
    }

    public setCustomerGlobal(customer: Customer): void {
        if (customer.avatar == '') {
            customer.avatar = environment.defaultAvatar
        }
        this.customerGlobal.next(customer);
    }

    private getHttpHeaders(): HttpHeaders {
        var data = localStorage.getItem('USER');
        var headers = new HttpHeaders();
        if (data) {
            var user: User = JSON.parse(data);
            headers = headers.set('Content-Type', 'application/json; charset=utf-8');
            headers = headers.set('Authorization', 'Bearer ' + user.token);
        }
        return headers;
    }

    getCustomerInfo(id: string) {
        return this.http.get<Customer>(this.baseUrl + "/api/v1/customers", { observe: 'response', headers: this.httpHeaders, params: { id: id } })
    }

    getBalance() {
        return this.http.get<number>(this.baseUrl + "/api/v1/wallets/balance", { observe: 'response', headers: this.httpHeaders })
    }

    updateCustomerInfo(info: any) {
        return this.http.put<any>(this.baseUrl + '/api/v1/customers/update/', info, { headers: this.httpHeaders, observe: 'response' })
    }

    updateAvatar(data: FormData) {
        var headers = this.httpHeaders;
        headers = headers.delete('Content-Type');
        headers = headers.set('enctype', 'multipart/form-data');
        return this.http.post(this.baseUrl + '/api/v1/customers/avatar', data, { headers: headers, observe: 'response' })
    }

    getSubscription() {
        return this.http.get<IsSubscription>(this.baseUrl + '/api/v1/subscriptions/register', { headers: this.httpHeaders, observe: 'response' })
    }

    registerSubscription(day: number) {
        return this.http.post<number>(this.baseUrl + '/api/v1/subscriptions/register/' + day, day, { headers: this.httpHeaders, observe: 'response' })
    }

    getAllSubscription() {
        return this.http.get(this.baseUrl + '/api/v1/subscriptions', { headers: this.httpHeaders, observe: 'response' })
    }
}
