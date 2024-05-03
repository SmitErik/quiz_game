import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../model/Quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Quiz[]>('http://localhost:5000/app/getAllQuizzes', {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:5000/app/deleteQuiz?id=' + id, {withCredentials: true});
  }
}
