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

@Component({
  selector: 'app-admin-quiz-view',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent {
  isLoading = true;
  quizzesColumns = ['questions', 'answers1', 'answers2', 'answers3', 'answers4', 'delete'];
  quiz!: Quiz;
  originalQuiz!: Quiz;
  quizToDisplay: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private dialog: MatDialog) { }

  ngOnInit() {
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('quizId');
    //TODO: get the quiz
    this.originalQuiz = { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] };
    this.quiz = JSON.parse(JSON.stringify(this.originalQuiz));

    this.getDisplayQuiz();
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
      questions: "",
      answers1: "",
      answers2: "",
      answers3: "",
      answers4: "",
      correctAnswer: 0
    });

    this.isLoading = false;
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
    //TODO: el is menteni a változtatásokat xd
    
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
      this.router.navigateByUrl('/admin/quizzes');
    }
  }
  
  isLastRow(index: number): boolean {
    return index === this.quizToDisplay.length - 1;
  }

  isCorrect(n: number, i: number): boolean {
    return this.quiz.correctAnswers[i] === n;
  }

  setCorrect(n: number, i: number) {
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
      if (quiz1.answers2[i] !== quiz2.answers3[i])
        return false;
      if (quiz1.answers2[i] !== quiz2.answers3[i])
        return false;
      if (quiz1.answers2[i] !== quiz2.answers3[i])
        return false;
    }
    
    return true;
  }
}
