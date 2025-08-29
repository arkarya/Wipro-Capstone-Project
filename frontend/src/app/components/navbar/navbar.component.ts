import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserDetails } from 'src/app/models/user/user.module';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: UserDetails | null = null;
  isLogged: boolean = false;
  showLogo = true;

  private destroy$ = new Subject<void>();

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Get user info
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
      });

    // Fix: Properly update isLogged
    this.auth.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isLogged = status;
      });
  }

  // Admin check
  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.isLogged = false;
        this.user = null;
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Logout failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
