import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/models/booking/booking.module';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  error = '';
  deletingId: number | null = null;

  constructor(private api: ApiService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      this.error = 'User not logged in.';
      this.loading = false;
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      this.error = 'User data corrupted.';
      this.loading = false;
      return;
    }

    const userId = user.id;
    if (!userId) {
      this.error = 'User ID not found.';
      this.loading = false;
      return;
    }

    this.api.listBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load bookings. Please try again.';
        console.error(err);
      },
    });
  }

  edit(booking: Booking): void {
    this.router.navigate(['/booking/edit', booking.id]);
  }

  delete(booking: Booking): void {
    if (!booking.id) return;

    const confirmed = confirm(`Are you sure you want to delete this booking?`);
    if (!confirmed) return;

    this.deletingId = booking.id;
    this.api.deleteBooking(booking.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.load(); // Refresh list after deletion
      },
      error: (err) => {
        this.deletingId = null;
        this.error = 'Failed to delete booking.';
        console.error(err);
      },
    });
  }
}
