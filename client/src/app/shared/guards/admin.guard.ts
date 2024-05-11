import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const r = inject(Router);

  return inject(AuthService).checkAuth().pipe(map(isAuthenticated => {
    if (!isAuthenticated) {
      r.navigateByUrl('/login');
      return false;
    } else {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')!);
      if (loggedInUser._id === "000000000000000000000000") {
        return true;
      } else {
        r.navigateByUrl('/login');
        return false;
      }
    }
  }), catchError(error => {
    console.log(error);
    r.navigateByUrl('/login');
    return of(false);
  }));
};
