import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { LoginComponent } from './users/login/login.component';
import {FormsModule} from '@angular/forms';
import { CreateAccountComponent } from './users/create-account/create-account.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';

import { AccountService } from './users/account.service';
import { MainComponent } from './mainapp/main/main.component';
import { TaskComponent } from './tasks/task/task.component';
import { StartComponent } from './mainapp/start/start.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { CookieService } from 'ngx-cookie-service';
import { SideBarComponent } from './mainapp/side-bar/side-bar.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { TaskPageComponent } from './mainapp/task-page/task-page.component';
import { FeedComponent } from './social/feed/feed.component';
import { FeedListingComponent } from './social/feed-listing/feed-listing.component';
import { CommentSectionComponent } from './social/comment-section/comment-section.component';
import { FeedPageComponent } from './mainapp/feed-page/feed-page.component';
import { ProfilePageComponent } from './mainapp/profile-page/profile-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from './users/edit-profile/edit-profile.component';
 
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
    SideBarComponent,
    TaskCreateComponent,
    TaskPageComponent,
    FeedComponent,
    FeedListingComponent,
    CommentSectionComponent,
    FeedPageComponent,
    ProfilePageComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
