import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { IncomeDashboardComponent } from './income-dashboard/income-dashboard.component';
import { ExpenseDashboardComponent } from './expense-dashboard/expense-dashboard.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path:'income-dashboard',component:IncomeDashboardComponent,canActivate: [AuthGuard]},
  {path:'expense-dashboard',component:ExpenseDashboardComponent,canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
