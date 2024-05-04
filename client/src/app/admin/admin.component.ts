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
import { MatTableDataSource } from '@angular/material/table';

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
  usersColumns = ['email', 'nickname', 'score', 'finishedQuizzes', 'delete'];
  dataSource = new MatTableDataSource<User>(this.users);
  
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
      this.users = [
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 0, finishedQuizzes: [] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 20, finishedQuizzes: ['', ''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 20, finishedQuizzes: ['', ''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 60, finishedQuizzes: ['', '', '', '', '', ''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 10, finishedQuizzes: [''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 10, finishedQuizzes: [''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 50, finishedQuizzes: ['', '', '', '', ''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 0, finishedQuizzes: [] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 50, finishedQuizzes: ['', '', '', '', ''] },
        { email: "asd@asd", nickname: "asd", password: "asdasd", score: 80, finishedQuizzes: ['', '', '', '', '', '', '', ''] }
      ];

      /*this.userService.getAll().subscribe({
        next: (data) => {
          this.users = data;
          console.log(this.users);
          this.isLoading = false;
        }, error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });*/
      
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.data = this.dataSource.data.sort((a, b) => {
        if (a['score'] < b['score']) return 1;
        if (a['score'] > b['score']) return -1;
        return 0;
      });
    }
    else {
      this.quizzes = [
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'], correctAnswers: [1, 2, 3] },
      ];

      /*this.quizService.getAll().subscribe({
        next: (data) => {
          this.quizzes = data;
          console.log(this.quizzes);
          this.isLoading = false;
        }, error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });*/
      
      this.quizzes.push({
        title: "",
        questions: [],
        answers1: [],
        answers2: [],
        answers3: [],
        answers4: [],
        correctAnswers: []
      });
    }
    this.isLoading = false;
  }

  switchTable(user: boolean) {
    this.usersTable = user;
    this.router.navigateByUrl(`/admin/${user ? 'users' : 'quizzes'}`);

    this.loadTable();
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

  deleteUser(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
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
          console.log(data);
          this.userService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.users?.splice(n, 1);
              this.users = [...this.users];
              this.openSnackBar('User deleted successfully.', 3000);
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
          console.log(data);
          this.quizService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.quizzes?.splice(n, 1);
              this.quizzes = [...this.quizzes];
              this.openSnackBar('Quiz deleted successfully.', 3000);
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

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }

  openQuiz(quizId: number) {
    if (!this.isDialogOpen) {
      if (!this.isLastRow(quizId))
        this.router.navigate(['/admin/quizzes', quizId]);
      else {
        this.addNewRow();
      }
    }
  }
  
  isLastRow(index: number): boolean {
    return index === this.quizzes.length - 1;
  }

  addNewRow() {
    //TODO - új sor, loading, navigálás tovább, ha sikeres
  }
}
