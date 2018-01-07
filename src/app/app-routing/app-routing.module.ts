import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

   const routes: Routes = [
      {
          path: '',
          component: HomeComponent,
       },
       {
           path: 'charts',
           component: ChartsComponent,
       },
       {
            path: 'log-in',
            component: LogInComponent,
       },
       {
            path: 'sign-up',
            component: SignUpComponent,
       },
       {
            path: 'user-profile',
            component: UserProfileComponent,
       }
   ];

   @NgModule({
       imports: [
           RouterModule.forRoot(routes)
       ],
       exports: [
           RouterModule
       ],
       declarations: []
   })
   export class AppRoutingModule { }
