import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/login/login.component';
import { CreateAccountComponent } from './users/create-account/create-account.component';
import { MainComponent } from './homepage/main/main.component';
import { StartComponent } from './homepage/start/start.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'app', pathMatch: 'prefix', children: [
    { path:'**', component: MainComponent }
  ]},
  { path: '', component: StartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
