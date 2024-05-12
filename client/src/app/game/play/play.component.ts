import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Quiz } from '../../shared/model/Quiz';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {
  @Input() quiz!: Quiz;
  answers = ['', '', '', ''];
  currentQuestion = 0;
  score = 0;
  questionCount = 1;
  
  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentQuestion = 0;
    this.score = 0;
    this.questionCount = this.quiz.questions.length;
    this.loadAnswers();
  }

  loadAnswers() {
    let a = [0, 1, 2, 3];
    let pos = [0];
    for (let i = 4; i > 0; i--) {
      switch (i) {
        case 4:
          if (this.quiz.answers4[this.currentQuestion]) {
            pos[0] = Math.floor(Math.random() * 4);
            pos = a.splice(pos[0], 1);
            a = [...a];
            this.answers[pos[0]] = this.quiz.answers4[this.currentQuestion];
          } else {
            a.pop();
          }
          break;
        case 3:
          if (this.quiz.answers3[this.currentQuestion]) {
            pos[0] = Math.floor(Math.random() * 3);
            pos = a.splice(pos[0], 1);
            a = [...a];
            this.answers[pos[0]] = this.quiz.answers3[this.currentQuestion];
          } else {
            a.pop();
          }
          break;
        case 2:
          pos[0] = Math.floor(Math.random() * 2);
          pos = a.splice(pos[0], 1);
          a = [...a];
          this.answers[pos[0]] = this.quiz.answers2[this.currentQuestion];
          break;
        case 1:
          this.answers[a[0]] = this.quiz.answers1[this.currentQuestion];
          break;
      }
    }
  }
  
  selectAnswer(n: number) {    
    if (this.answers[n - 1] === this.quiz.answers1[this.currentQuestion] && this.quiz.correctAnswers[this.currentQuestion] === 1 ||
        this.answers[n - 1] === this.quiz.answers2[this.currentQuestion] && this.quiz.correctAnswers[this.currentQuestion] === 2 ||
        this.answers[n - 1] === this.quiz.answers3[this.currentQuestion] && this.quiz.correctAnswers[this.currentQuestion] === 3 ||
        this.answers[n - 1] === this.quiz.answers4[this.currentQuestion] && this.quiz.correctAnswers[this.currentQuestion] === 4) {
      this.score += 100 / this.questionCount;      
    }
    if (this.currentQuestion + 1 < this.questionCount) {
      this.nextQuestion();
    } else {
      this.finishQuiz();
    }
  }

  nextQuestion() {
    this.currentQuestion++;
    this.loadAnswers();
  }

  finishQuiz() {
    const user = JSON.parse(localStorage.getItem('loggedInUser')!);
    const quizIndex = user.playedQuizzes.indexOf(this.quiz.title);
    let userScore = 0;
    for (let i = 0; i < user.scores.length; i++) {
      if (i === quizIndex && user.scores[i] < this.score) {
        userScore += this.score;
      }
      else {
        userScore += user.scores[i];
      }
    }
    
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'GRATULÁLUNK',
        message: `A ${this.quiz.title} kvíz végére ért.\nTeljesítmény: ${this.score}%\nÖsszes pontszám: ${userScore}`,
        choice: true,
        cancelChoice: 'Kilépés',
        proceedChoice: 'Újra'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (user.scores[quizIndex] < this.score)
          user.scores[quizIndex] = this.score;
        this.userService.update(user._id, user).subscribe({
          next: (_) => {
            if (data) {
              localStorage.setItem('loggedInUser', JSON.stringify(user));
              this.currentQuestion = 0;
              this.score = 0;
              this.questionCount = this.quiz.questions.length;
              this.loadAnswers();
            }
            else {
              localStorage.setItem('loggedInUser', JSON.stringify(user));
              location.reload();
            }
          }, error: (err) => {
            console.log(err);
          }
        });
      }, error: (err) => {
        console.log(err);
      }
    })
  }
}
