import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthService, AuthModule } from '@auth0/auth0-angular';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideAuth0({
      domain: 'dev-u4k7xup0c3hwxmb4.us.auth0.com',
      clientId: 'FXK6XzX1pvFlxnmaZnoLJoCcnhw20wwq',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
}).catch((err) => console.error(err));
  

