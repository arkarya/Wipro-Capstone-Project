import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserDetails } from 'src/app/models/user/user.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  userDetails: UserDetails = {
    id: 0,
    name: '',
    email : '',
    logged: false,
    message: '',
    role : ''
  };

  message: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private router: Router, private service: AuthService) {}

  login() {
    this.error = '';
    this.message = '';
    this.loading = true;

    this.service.loginUser(this.email, this.password).subscribe({
      next: (data) => {
        this.userDetails = data;
        this.message = this.userDetails.message || 'Login successful!';
        this.loading = false;

        // Navigate after a small delay to show message
        setTimeout(() => this.router.navigate(['/packages']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
        this.password = '';
      }
    });
  }
}
