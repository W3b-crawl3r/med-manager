import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

export const serverLogOutInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
