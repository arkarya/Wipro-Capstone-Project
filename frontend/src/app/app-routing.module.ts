import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { BookingCrudComponent } from './components/booking-crud/booking-crud.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { AddPackageComponent } from './components/add-package/add-package.component';

const routes: Routes = [
  { path: '', component: PackageListComponent },
  { path: 'packages', redirectTo: '', pathMatch: 'full' },
  { path: 'package/:id', component: PackageDetailsComponent },
  { path: 'packages/new', component: AddPackageComponent},
  { path: 'packages/edit/:id', component: AddPackageComponent},
  { path: 'bookings', component: BookingHistoryComponent },
  { path: 'booking/edit/:id', component: BookingCrudComponent },
  { path: 'booking/new/:packageId', component: BookingCrudComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
