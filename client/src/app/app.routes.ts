import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'admin', redirectTo: 'admin/users', pathMatch: 'full' },
    { path: 'admin/users', loadComponent: () => import('./admin/admin.component').then((c) => c.AdminComponent), canActivate: [adminGuard] },
    { path: 'admin/quizzes', loadComponent: () => import('./admin/admin.component').then((c) => c.AdminComponent), canActivate: [adminGuard] },
    { path: 'admin/quizzes/:quizId', loadComponent: () => import('./admin/quiz-view/quiz-view.component').then((c) => c.QuizViewComponent), canActivate: [adminGuard] },
    { path: 'game', loadComponent: () => import('./game/game.component').then((c) => c.GameComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];
