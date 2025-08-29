import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDetails, Register } from '../models/user/user.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:5000/api';

  // Reactive login status
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private currentUser = new BehaviorSubject<UserDetails | null>(null);
  user$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // Restore user state from localStorage if exists
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.next(JSON.parse(storedUser));
      this.loggedIn.next(true);
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
  
  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.id || 0;
  }

  loginUser(email: string, password: string): Observable<UserDetails> {
    const body = { email, password };
    return this.http.post<UserDetails>(`${this.url}/login`, body).pipe(
      tap(user => {
        this.loggedIn.next(true);
        this.currentUser.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user)); // persist user
      })
    );
  }

  registerUser(user: Register): Observable<any> {
    return this.http.post(`${this.url}/register`, user)
  }

  logout(): Observable<any> {
    const body = { logged: false, id: this.currentUser.value?.id };
    return this.http.put(`${this.url}/logout`, body).pipe(
      tap(() => {
        this.loggedIn.next(false);
        this.currentUser.next(null);
        localStorage.removeItem('currentUser'); // clear persistence on logout
      })
    );
  }

  // Optional getters
  get isLogged(): boolean {
    return this.loggedIn.value;
  }

  

  get user(): UserDetails | null {
    return this.currentUser.value;
  }
}
