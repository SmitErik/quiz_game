import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>('http://localhost:5000/app/getAllUsers', {withCredentials: true});
  }

  get(id: string) {
    return this.http.get<User>('http://localhost:5000/app/getUser?id=' + id, {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:5000/app/deleteUser?id=' + id, {withCredentials: true});
  }

  getAllNames() {
    return this.http.get<[{nickname: string, score: number, quizzesCount: number}]>('http://localhost:5000/app/getAllUserNames', {withCredentials: true});
  }
}
