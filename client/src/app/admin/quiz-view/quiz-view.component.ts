import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Quiz } from '../../shared/model/Quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { QuizService } from '../../shared/services/quiz.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-quiz-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, FormsModule, MatSnackBarModule],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent {
  isLoading = true;
  quizzesColumns = ['questions', 'answers1', 'answers2', 'answers3', 'answers4', 'delete'];
  quiz: Quiz = { title: "", questions: [], answers1: [], answers2: [], answers3: [], answers4: [], correctAnswers: [] };
  originalQuiz!: Quiz;
  quizToDisplay: any[] = [];
  id?: string | null;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private quizService: QuizService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.id = this.route.snapshot.paramMap.get('quizId');
    this.quizService.get(this.id!).subscribe({
      next: (data) => {
        this.originalQuiz = data;
        this.quiz = JSON.parse(JSON.stringify(this.originalQuiz));
        this.getDisplayQuiz();
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  getDisplayQuiz() {
    this.isLoading = true;
    this.quizToDisplay = [];

    for (let i = 0; i < this.quiz.questions.length; i++)
      this.quizToDisplay.push({
        questions: this.quiz.questions[i],
        answers1: this.quiz.answers1[i],
        answers2: this.quiz.answers2[i],
        answers3: this.quiz.answers3[i],
        answers4: this.quiz.answers4[i],
        correctAnswer: this.quiz.correctAnswers[i]
      });

    this.quizToDisplay.push({
      questions: null,
      answers1: null,
      answers2: null,
      answers3: null,
      answers4: null,
      correctAnswer: 0
    });

    this.isLoading = false;
  }

  semiSave(index: number, n: number) {
    switch (n) {
      case 0:
        this.quiz.questions[index] = this.quizToDisplay[index].questions;
        break;
      case 1:
        this.quiz.answers1[index] = this.quizToDisplay[index].answers1;
        break;
      case 2:
        this.quiz.answers2[index] = this.quizToDisplay[index].answers2;
        break;
      case 3:
        this.quiz.answers3[index] = this.quizToDisplay[index].answers3;
        break;
      case 4:
        this.quiz.answers4[index] = this.quizToDisplay[index].answers4;
        break;
    }
  }

  goBack() {
    if (!this.quizCompare(this.quiz, this.originalQuiz)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          message: 'Ha most kilépsz, a változtatásaid el fognak veszni. Biztos vagy benne?',
          choice: true,
          cancelChoice: 'Vissza',
          proceedChoice: 'Kilépés'
        }
      });

      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data)
            this.location.back();
        }, error: (err) => {
          console.log(err);
        }
      })
    }
    else
      this.location.back();
  }

  save() {
    if (document.querySelector('.invalid-input') !== null) {
      this.dialog.open(DialogComponent, {
        data: {
        message: 'Néhány kötelező mező nincs kitöltve!',
        choice: false,
        cancelChoice: 'Vissza'
        }
      });
    }
    else {
      if (this.quizCompare(this.quiz, this.originalQuiz)) {
        this.router.navigateByUrl('/admin/quizzes');
        return;
      }

      this.isLoading = true;
      this.quizService.update(this.id!, this.quiz).subscribe({
        next: (_) => {
          this.isLoading = false;
          this.snackBar.open(`A ${this.quiz.title} kvíz sikeresen frissült.`, 'Rendben', { duration: 3000 });
          this.router.navigateByUrl('/admin/quizzes');
        }, error: (err) => {
          this.isLoading = false;
          if (err.status === 400) {
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Ilyen című kvíz már létezik!',
                choice: false,
                cancelChoice: 'Vissza'
              }
            });
          } else {
            console.log(err);
          }
        }
      });
    }
  }
  
  isLastRow(index: number): boolean {
    return index === this.quizToDisplay.length - 1;
  }

  isCorrect(n: number, i: number): boolean {
    return this.quiz.correctAnswers[i] === n;
  }

  setCorrect(n: number, i: number) {
    if (n < 3 || n === 3 && this.quiz.answers3[i] || n === 4 && this.quiz.answers4[i])
      this.quiz.correctAnswers[i] = n;
  }

  addNewRow(index: number) {
    if (!this.isLastRow(index))
      return;

    this.quiz.questions.push("");
    this.quiz.answers1.push("");
    this.quiz.answers2.push("");
    this.quiz.answers3.push("");
    this.quiz.answers4.push("");
    this.quiz.correctAnswers.push(1);

    this.getDisplayQuiz();
  }

  deleteQuestion(n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'FIGYELEM',
        message: 'Biztos vagy benne, hogy ki akarod törölni ezt a kérdést?',
        choice: true,
        cancelChoice: 'Mégse',
        proceedChoice: 'Törlés'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.isLoading = true;

          this.quiz.questions?.splice(n, 1);
          this.quiz.answers1?.splice(n, 1);
          this.quiz.answers2?.splice(n, 1);
          this.quiz.answers3?.splice(n, 1);
          this.quiz.answers4?.splice(n, 1);
          
          this.getDisplayQuiz();
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  quizCompare(quiz1: Quiz, quiz2: Quiz): boolean {
    if (quiz1.title !== quiz2.title || quiz1.questions.length !== quiz2.questions.length)
      return false;
    
    for (let i = 0; i < quiz1.questions.length; i++) {
      if (quiz1.questions[i] !== quiz2.questions[i])
        return false;
      if (quiz1.answers1[i] !== quiz2.answers1[i])
        return false;
      if (quiz1.answers2[i] !== quiz2.answers2[i])
        return false;
      if (quiz1.answers3[i] !== quiz2.answers3[i])
        return false;
      if (quiz1.answers4[i] !== quiz2.answers4[i])
        return false;
    }
    
    return true;
  }
}
