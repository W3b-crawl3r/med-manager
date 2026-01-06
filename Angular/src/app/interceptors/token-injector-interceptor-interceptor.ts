import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';

export const tokenInjectorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  
  if (auth.isLoggedIn()) {
    const token = auth.getToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
