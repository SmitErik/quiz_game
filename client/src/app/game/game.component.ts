import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../shared/model/User';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { QuizService } from '../shared/services/quiz.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../shared/services/user.service';
import { PlayComponent } from './play/play.component';
import { Quiz } from '../shared/model/Quiz';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, PlayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  isLoading = false;
  play = false;
  user!: User;
  quizzes = [{_id: "", title: "", questionCount: 0}];
  selectedQuiz = 0;
  quizToPlay!: Quiz;

  users!: User[];
  columns = ['rank', 'nickname', 'score', 'quizzesCount']

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
        this.userService.getAll().subscribe({
          next: (data) => {
            this.users = (data.filter(user => user.nickname !== 'admin')).sort(this.sortUserTable);
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
    this.isLoading = true;
    this.quizService.get(this.quizzes[this.selectedQuiz]._id).subscribe({
      next: (data) => {
        if (!this.user.playedQuizzes.includes(data.title)) {
          this.user.playedQuizzes.push(data.title);
          this.user.scores.push(0);
          
          this.userService.update(JSON.parse(localStorage.getItem('loggedInUser')!)._id, this.user).subscribe({
            next: (_) => {
              localStorage.setItem('loggedInUser', JSON.stringify(this.user));
              this.quizToPlay = data;
              this.play = true;
              this.isLoading = false;
            }, error: (err) => {
              this.isLoading = false;
              console.log(err);
            }
          });
        }
        else {
          this.quizToPlay = data;
          this.play = true;
          this.isLoading = false;
        }
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
    
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
    this.getScore();
  }

  sortUserTable(a: User, b: User) {
    function sum(scores: number[]): number {    
      let sum = 0;
      scores.forEach(num => {sum += num})
      return sum;
    }

    if (sum(a['scores']) < sum(b['scores'])) return 1;
    if (sum(a['scores']) > sum(b['scores'])) return -1;
    return 0;
  }

  sumScores(scores: number[]): number {    
    let sum = 0;
    scores.forEach(num => {sum += num})
    return sum;
  }

  getScore(): number {
    const position = this.user.playedQuizzes.indexOf(this.quizzes[this.selectedQuiz].title);
    if (position !== -1) {
      return this.user.scores[position];
    } else {
      return 0;
    }
  }
}
