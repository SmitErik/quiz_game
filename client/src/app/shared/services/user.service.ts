import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>('http://172.100.0.20:5000/app/getAllUsers', {withCredentials: true});
  }

  get(id: string) {
    return this.http.get<User>('http://172.100.0.20:5000/app/getUser?id=' + id, {withCredentials: true});
  }

  update(id: string, user: User) {
    const body = new URLSearchParams();
    body.set('scores', JSON.stringify(user.scores));
    body.set('playedQuizzes', JSON.stringify(user.playedQuizzes));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put('http://172.100.0.20:5000/app/updateUser?id=' + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://172.100.0.20:5000/app/deleteUser?id=' + id, {withCredentials: true});
  }
}
