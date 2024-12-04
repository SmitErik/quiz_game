import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { server } from '../variables/ip_adresses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${server}/app/login`, body, {headers: headers, withCredentials: true});
  }

  register(user: User) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('nickname', user.nickname);
    body.set('password', user.password);
    body.set('scores', JSON.stringify([]));
    body.set('playedQuizzes', JSON.stringify([]));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${server}/app/register`, body, {headers: headers});
  }

  logout() {
    return this.http.post(`${server}/app/logout`, {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>(`${server}/app/checkAuth`, {withCredentials: true});
  }
}
