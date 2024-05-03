import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;

  regex: RegExp = /^(?=.{0,254}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  isEmailValid = true;

  constructor(private router: Router, private authService: AuthService) { }

  checkEmail(focused: boolean) {
    this.isEmailValid = focused ? true : this.regex.test(this.email);
  }

  login() {
    this.isLoading = true;
    if (this.email && this.password) {
      this.errorMessage = '';
      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.isLoading = false;
            this.router.navigateByUrl('/admin');
          }
        }, error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      })
    } else {
      this.isLoading = false;
      this.errorMessage = 'Az űrlap nincs teljesen kitöltve!';
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
