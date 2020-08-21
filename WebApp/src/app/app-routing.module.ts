import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/login/login.component';
import { CreateAccountComponent } from './users/create-account/create-account.component';
import { MainComponent } from './mainapp/main/main.component';
import { StartComponent } from './mainapp/start/start.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { TaskPageComponent } from './mainapp/task-page/task-page.component';
import { FeedPageComponent } from './mainapp/feed-page/feed-page.component';
import { ProfilePageComponent } from './mainapp/profile-page/profile-page.component';
import { FriendPageComponent } from './mainapp/friend-page/friend-page.component';
import { SearchPageComponent } from './mainapp/search-page/search-page.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'app', pathMatch: 'prefix', children: [
    { path: 'tasks', component: TaskPageComponent},
    { path:'', component: MainComponent },
    { path: 'feed', component: FeedPageComponent},
    { path: 'profile', component: ProfilePageComponent},
    { path: 'users/:username', component: FriendPageComponent},
    { path: 'search', component: SearchPageComponent}
  ]},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: '', component: StartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
