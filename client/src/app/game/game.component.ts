import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../shared/model/User';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Quiz } from '../shared/model/Quiz';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  isLoading = false;
  user!: User;
  quizzes!: Quiz[];
  selectedQuiz = "";
  selectedQuizId = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;

    //TODO: get the user
    this.user = { email: "asd@asd", nickname: "asd", password: "asdasd", score: 0, finishedQuizzes: [] };

    //TODO: get quiz names and/or id's
    
    this.quizzes = [
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1zzzzzzzzzzzzzzzzz", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
    ];

    this.selectedQuizId = 0;
    this.selectedQuiz = this.quizzes[0].title;

    this.isLoading = false;
  }

  startGame() {
    //TODO: start a game with the selected quiz (or id)
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
        this.isLoading = false;
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  chooseQuiz(n: number) {
    this.selectedQuizId = n;
    this.selectedQuiz = this.quizzes[n].title;
  }
}
