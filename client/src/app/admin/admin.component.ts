import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Quiz } from '../shared/model/Quiz';
import { QuizService } from '../shared/services/quiz.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule,  MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isLoading = true;
  usersTable = true;
  isDialogOpen = false;

  users!: User[];
  usersColumns = ['email', 'nickname', 'score', 'quizzesCount', 'delete'];
  
  quizzes!: Quiz[];
  quizzesColumns = ['title', 'questions', 'answers1', 'answers2', 'answers3', 'answers4', 'delete'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private quizService: QuizService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.usersTable = this.router.url.endsWith('users');
    this.loadTable();
  }

  loadTable() {
    this.isLoading = true;

    if (this.usersTable) {
      this.userService.getAll().subscribe({
        next: (data) => {
          this.users = data.sort(this.sortUserTable);
          this.isLoading = false;
        }, error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
    }
    else {
      this.quizService.getAll().subscribe({
        next: (data) => {
          this.quizzes = data;
          this.quizzes.push({
            title: "",
            questions: [],
            answers1: [],
            answers2: [],
            answers3: [],
            answers4: [],
            correctAnswers: []
          });
          this.isLoading = false;
        }, error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
    }
    this.isLoading = false;
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

  switchTable(user: boolean) {
    this.usersTable = user;
    this.router.navigateByUrl(`/admin/${user ? 'users' : 'quizzes'}`);

    this.loadTable();
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: (_) => {
        this.router.navigateByUrl('/login');
        this.isLoading = false;
      }, error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'FIGYELEM',
        message: 'Biztos vagy benne, hogy ki akarod törölni ezt a felhasználót?',
        choice: true,
        cancelChoice: 'Mégse',
        proceedChoice: 'Törlés'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.isLoading = true;
          this.userService.delete(id).subscribe({
            next: (data) => {
              this.users?.splice(n, 1);
              this.users = [...this.users];
              this.snackBar.open(`A ${(data as any).nickname} felhasználó sikeresen törölve lett.`, 'Rendben', { duration: 3000 });
              this.isLoading = false;
            }, error: (err) => {
              console.log(err);
              this.isLoading = false;
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  deleteQuiz(id: string, n: number) {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'FIGYELEM',
        message: 'Biztos vagy benne, hogy ki akarod törölni ezt a kvízt?',
        choice: true,
        cancelChoice: 'Mégse',
        proceedChoice: 'Törlés'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.isLoading = true;
          this.quizService.delete(id).subscribe({
            next: (data) => {
              this.quizzes?.splice(n, 1);
              this.quizzes = [...this.quizzes];
              this.snackBar.open(`A ${(data as Quiz).title} kvíz sikeresen törölve lett.`, 'Rendben', { duration: 3000 });
              this.isLoading = false;
            }, error: (err) => {
              console.log(err);
              this.isLoading = false;
            }
          });
        }
        this.isDialogOpen = false;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openQuiz(quizId: string) {
    if (!this.isDialogOpen) {
      if (quizId != undefined)
        this.router.navigate(['/admin/quizzes', quizId]);
      else {
        this.addNewRow();
      }
    }
  }
  
  isLastRow(index: number): boolean {
    return index === this.quizzes.length - 1;
  }

  notAdmin(element: any): boolean {
    return element._id !== "000000000000000000000000";
  }

  addNewRow() {
    this.isLoading = true;

    const quiz = {
      title: 'Új kvíz 1',
      questions: ['Első kérdés?'],
      answers1: ['Első válasz.'],
      answers2: ['Második válasz.'],
      answers3: [''],
      answers4: [''],
      correctAnswers: [1]
    };

    this.quizService.create(quiz).subscribe({
      next: (data) => {
        this.loadTable();
        this.snackBar.open(`${(data as Quiz).title} sikeresen létre lett hozva.`, 'Rendben', { duration: 3000 });
      }, error: (err) => {
        this.isLoading = false;
        console.log(err);
      }
    });
  }
}
