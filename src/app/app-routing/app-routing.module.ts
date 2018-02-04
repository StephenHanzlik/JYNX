import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SharablePortfolioComponent } from '../sharable-portfolio/sharable-portfolio.component';
import { AdminComponent } from '../admin/admin.component';

   const routes: Routes = [
      {
          path: '',
          component: HomeComponent,
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
            path: 'admin',
            component: AdminComponent,
       },
       {
            path: 'sharable-portfolio',
            component: SharablePortfolioComponent,
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
