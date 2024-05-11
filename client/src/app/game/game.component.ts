import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../shared/model/User';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuizService } from '../shared/services/quiz.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  isLoading = false;
  user!: User;
  quizzes = [{_id: "", title: "", questionCount: 0}];
  selectedQuiz = 0;
  users!: [{nickname: string, score: number, quizzesCount: number}];
  columns = ['nickname', 'score', 'quizzesCount']
  dataSource = new MatTableDataSource<{nickname: string, score: number, quizzesCount: number}>(this.users);

  constructor (
    private authService: AuthService,
    private userService: UserService,
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.user = JSON.parse(localStorage.getItem('loggedInUser')!);
    
    this.quizService.getAllTitles().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.userService.getAllNames().subscribe({
          next: (data) => {
            this.dataSource = new MatTableDataSource<{nickname: string, score: number, quizzesCount: number}>(this.users);
            this.users = data.filter(user => user.nickname !== 'admin') as [{ nickname: string; score: number; quizzesCount: number; }];
            this.dataSource.data = this.dataSource.data.sort(this.sortUserTable);
            this.isLoading = false;
          }, error: (err) => {
            console.log(err);
            this.isLoading = false;
          }
        });
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  startGame() {
    //TODO: start a game with the selected quiz (or id)
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: (_) => {
        localStorage.removeItem('loggedInUser');
        this.router.navigateByUrl('/login');
        this.isLoading = false;
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  chooseQuiz(n: number) {
    this.selectedQuiz += n;

    if (this.selectedQuiz < 0)
      this.selectedQuiz = this.quizzes.length - 1;
    else if (this.selectedQuiz === this.quizzes.length)
      this.selectedQuiz = 0;
  }
  
  sortUserTable(a: any, b: any) {
    if (a['score'] < b['score']) return 1;
    if (a['score'] > b['score']) return -1;
    return 0;
  }
}
