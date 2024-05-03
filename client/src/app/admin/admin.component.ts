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
  isLoading = false;
  usersTable = true;

  users!: User[];
  usersColumns = ['email', 'nickname', 'delete'];
  
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
    this.loadTable();
  }

  loadTable() {
    if (this.usersTable) {
      this.users = [
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
        { email: "asd@asd", nickname: "asd", password: "asdasd" },
      ];

      /*this.userService.getAll().subscribe({
        next: (data) => {
          this.users = data;
          console.log(this.users);
        }, error: (err) => {
          console.log(err);
        }
      });*/
    }
    else {
      this.quizzes = [
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
        { title: "Kvíz1", questions: ['Egy?', 'Kettő?', 'Három?'], answers1: ['Igen', 'Nem', 'Talán'], answers2: ['Igen', 'Nem', 'Talán'], answers3: ['Igen', 'Nem', 'Talán'], answers4: ['Igen', 'Nem', 'Talán'] },
      ];

      /*this.quizService.getAll().subscribe({
        next: (data) => {
          this.quizzes = data;
          console.log(this.quizzes);
        }, error: (err) => {
          console.log(err);
        }
      });*/
    }
  }

  switchTable(user: boolean) {
    this.usersTable = user;
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
      data: { target: 'felhasználót' }
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
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { target: 'kvízt' }
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
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}
