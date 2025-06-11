import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig, msalInstance } from './app/app.config';

console.log('🚀 Inicializando MSAL e Angular...');

msalInstance.initialize()
  .then(() => {
    console.log('✅ MSAL initialized');
    return bootstrapApplication(AppComponent, appConfig);
  })
  .then(() => {
    console.log('✅ Angular app started');
  })
  .catch(err => {
    console.error('❌ Erro no bootstrap:', err);
  });
