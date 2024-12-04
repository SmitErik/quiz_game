import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../model/Quiz';
import { server } from '../variables/ip_adresses';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Quiz[]>(`${server}/app/getAllQuizzes`, {withCredentials: true});
  }

  get(id: string) {
    return this.http.get<Quiz>(`${server}/app/getQuiz?id=` + id, {withCredentials: true});
  }

  update(id: string, quiz: Quiz) {
    const body = new URLSearchParams();
    body.set('title', quiz.title);
    body.set('questions', JSON.stringify(quiz.questions));
    body.set('answers1', JSON.stringify(quiz.answers1));
    body.set('answers2', JSON.stringify(quiz.answers2));
    body.set('answers3', JSON.stringify(quiz.answers3));
    body.set('answers4', JSON.stringify(quiz.answers4));
    body.set('correctAnswers', JSON.stringify(quiz.correctAnswers));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put(`${server}/app/updateQuiz?id=` + id, body, {headers: headers});
  }

  create(quiz: Quiz) {
    const body = new URLSearchParams();
    body.set('title', quiz.title);
    body.set('questions', JSON.stringify(quiz.questions));
    body.set('answers1', JSON.stringify(quiz.answers1));
    body.set('answers2', JSON.stringify(quiz.answers2));
    body.set('answers3', JSON.stringify(quiz.answers3));
    body.set('answers4', JSON.stringify(quiz.answers4));
    body.set('correctAnswers', JSON.stringify(quiz.correctAnswers));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${server}/app/createQuiz`, body, {headers: headers});
  }

  delete(id: string) {
    return this.http.delete(`${server}/app/deleteQuiz?id=` + id, {withCredentials: true});
  }

  getAllTitles() {
    return this.http.get<[{_id: string, title: string, questionCount: number}]>(`${server}/app/getAllQuizTitles`, {withCredentials: true});
  }
}
