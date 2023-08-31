import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/interface/interface.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { UploadFormComponent } from './components/forms/upload-form/upload-form.component';
import { StoreModule } from '@ngrx/store';
import { LoadingInterceptor } from './interceptors/loading-interceptor.interceptor';
import { spinnerReducer } from './stores/spinner/spinner.reducer';
import { NgTerminalModule } from 'ng-terminal';
import { authenticationReducer } from './stores/authentication/authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './stores/authentication/authentication.effects';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { jsonFileReducer } from './stores/data/data.reducer';
import { JsonViewerComponent } from './components/json-viewer/json-viewer.component';
import { EditorComponent } from './components/editor/editor.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { DataEffects } from './stores/data/data.effects';
import { MachinesComponent } from './components/machines/machines.component';
import { JsonDialogComponent } from './components/dialogs/json-dialog/json-dialog.component';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment as env } from '../environments/environment';
import { provideClientHydration } from '@angular/platform-browser';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: env.mqtt.hostname,
  port: env.mqtt.port,
  protocol: env.mqtt.protocol === 'wss' ? 'wss' : 'ws',
  path: '',
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginFormComponent,
    UploadFormComponent,
    JsonViewerComponent,
    EditorComponent,
    TerminalComponent,
    MachinesComponent,
    JsonDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgTerminalModule,
    NgxJsonViewerModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    StoreModule.forRoot({
      spinner: spinnerReducer,
      auth: authenticationReducer,
      data: jsonFileReducer,
    }),
    EffectsModule.forRoot([AuthenticationEffects, DataEffects]),
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
