import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { BalanceComponent } from './main/balance/balance.component';
import { HomeComponent } from './main/home/home.component';
import { CreateComponent } from './main/jobs/create/create.component';
import { DetailComponent } from './main/jobs/detail/detail.component';
import { DoneComponent } from './main/jobs/done/done.component';
import { PendingComponent } from './main/jobs/pending/pending.component';
import { ProcessingComponent } from './main/jobs/processing/processing.component';
import { WaitingComponent } from './main/jobs/waiting/waiting.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { SubscriptionComponent } from './main/subscription/subscription.component';
import { VocalDetailComponent } from './main/vocal-detail/vocal-detail.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main', component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'balance',
        component: BalanceComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
      },
      {
        path: 'jobs/detail/:id',
        component: DetailComponent
      },
      {
        path: 'jobs/create',
        component: CreateComponent
      },
      {
        path: 'jobs/processing',
        component: ProcessingComponent
      },
      {
        path: 'jobs/done',
        component: DoneComponent
      },
      {
        path: 'jobs/pending',
        component: PendingComponent
      },
      {
        path: 'jobs/waiting',
        component: WaitingComponent
      },
      {
        path: 'vocal/detail/:id',
        component: VocalDetailComponent
      },
    ],
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
