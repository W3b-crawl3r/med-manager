import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInjectorInterceptorInterceptor } from './interceptors/token-injector-interceptor-interceptor';
import { serverLogOutInterceptorInterceptor } from './interceptors/server-log-out-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInjectorInterceptorInterceptor, serverLogOutInterceptorInterceptor])),
  ]
};
