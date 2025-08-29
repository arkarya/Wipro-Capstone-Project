import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { BookingCrudComponent } from './components/booking-crud/booking-crud.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddPackageComponent } from './components/add-package/add-package.component';
import { UserComponent } from './components/user/user.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BookingHistoryComponent,
    BookingCrudComponent,
    PackageListComponent,
    PackageDetailsComponent,
    NavbarComponent,
    AddPackageComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
