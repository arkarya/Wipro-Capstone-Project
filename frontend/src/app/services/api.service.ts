import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package } from '../models/package/package.module';
import { Booking } from '../models/booking/booking.module';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Packages
  listPackages(q?: string): Observable<Package[]> {
    const url = q
      ? `${this.base}/packages/${q}`
      : `${this.base}/packages`;
    return this.http.get<Package[]>(url);
  }

  getPackage(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.base}/packages/${id}`);
  }

  createPackage(pkg: Package): Observable<Package> {
    return this.http.post<Package>(`${this.base}/packages`, pkg);
  }

  // Update a package
  updatePackage(id: number, pkg: Partial<Package>): Observable<Package> {
    return this.http.put<Package>(`${this.base}/packages/${id}`, pkg);
  }

  // Delete a package
  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/packages/${id}`);
  }

  // Bookings
  listBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings/users/${userId}`);
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/bookings/${id}`);
  }

  createBooking(b: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, b);
  }

  updateBooking(id: number, b: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.base}/bookings/${id}`, b);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/bookings/${id}`);
  }
}
