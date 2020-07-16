import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { LoginComponent } from './users/login/login.component';
import {FormsModule} from '@angular/forms';
import { CreateAccountComponent } from './users/create-account/create-account.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';

import { AccountService } from './users/account.service';
import { MainComponent } from './homepage/main/main.component';
import { TaskComponent } from './tasks/task/task.component';
import { StartComponent } from './homepage/start/start.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component'; 
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    TaskListComponent,
    MainComponent,
    TaskComponent,
    StartComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
