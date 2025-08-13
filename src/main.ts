import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthService, AuthModule, AuthGuard, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './app/services/auth-interceptor.service';




bootstrapApplication(AppComponent, {
  providers: [
    provideAuth0({
      domain: 'dev-u4k7xup0c3hwxmb4.us.auth0.com',
      clientId: 'FXK6XzX1pvFlxnmaZnoLJoCcnhw20wwq',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    ...(appConfig.providers || []),
    provideClientHydration()
  ]
}).catch((err) => console.error(err));
  




    
