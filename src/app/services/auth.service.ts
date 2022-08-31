import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = environment.baseUrl;
    private user: User = {
        id: '', username: '', email: '', phone: '', avatar: '', firstName: '',
        lastName: '', gender: '', role: '', status: '', token: ''
    };

    private httpHeaders: HttpHeaders;

    private userGlobal = new BehaviorSubject(this.user);

    constructor(private http: HttpClient) {
        this.httpHeaders = this.getHttpHeaders();
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

    public isAuth(): boolean {
        return localStorage.getItem('USER') ? true : false;
    }

    public getUserGlobal(): Observable<User> {
        return this.userGlobal.asObservable();
    }

    public setUserGlobal(user: User) {
        this.userGlobal.next(user);
        localStorage.setItem('USER', JSON.stringify(user));
    }

    signIn(auth: any) {
        return this.http.post(this.baseUrl + '/api/v1/authenticate/customer', auth, { observe: 'response' });
    }

    signUp(customer: any) {
        return this.http.post(this.baseUrl + '/api/v1/customers/register', customer, { observe: 'response' });
    }

    changePassword(email: string, newPassword: string, currentPassword: string) {
        var body: any = {
            email: email,
            password: newPassword,
            oldPassword: currentPassword
        }
        return this.http.put(this.baseUrl + '/api/v1/customers/password', body, { headers: this.httpHeaders, observe: 'response' });
    }

    forgetPassword(email: string) {
        var param = {
            email: email
        }
        return this.http.post<any>(this.baseUrl + '/api/v1/systems/otp', null, { headers: this.httpHeaders, observe: 'response', params: param });
    }

    verifyPassword(body: any) {
        return this.http.put<any>(this.baseUrl + '/api/v1/customers/forget-password', body, { headers: this.httpHeaders, observe: 'response' });
    }
}
