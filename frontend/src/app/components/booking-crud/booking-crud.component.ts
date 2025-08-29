import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Booking } from 'src/app/models/booking/booking.module';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-booking-crud',
  templateUrl: './booking-crud.component.html',
  styleUrls: ['./booking-crud.component.css']
})
export class BookingCrudComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  bookingId?: number;
  packageId?: number;

  packagePrice = 0;         // 💰 Package base price
  calculatedAmount = 0;     // 🧮 Final amount

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      total_adults: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      total_children: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      start_date: [{ value: '', disabled: true }, Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const pkgParam = this.route.snapshot.paramMap.get('packageId');

    // Recalculate when adults or children change
    this.form.get('total_adults')?.valueChanges.subscribe(() => this.calculateAmount());
    this.form.get('total_children')?.valueChanges.subscribe(() => this.calculateAmount());

    if (idParam) {
      // EDIT MODE
      this.isEdit = true;
      this.bookingId = Number(idParam);
      this.api.getBooking(this.bookingId).subscribe((booking) => {
        this.form.patchValue({
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          total_adults: booking.total_adults,
          total_children: booking.total_children,
          start_date: booking.start_date.split('T')[0],
        });
        this.packageId = booking.package_id;

        // Fetch package details to get price
        this.api.getPackage(booking.package_id).subscribe(pkg => {
          this.packagePrice = pkg.price;
          this.calculateAmount();
        });
      });
    } else if (pkgParam) {
      // CREATE MODE
      this.packageId = Number(pkgParam);
      this.api.getPackage(this.packageId).subscribe(pkg => {
        const startDate = pkg.start_date.split('T')[0];
        this.packagePrice = pkg.price;
        this.form.patchValue({ start_date: startDate });
        this.calculateAmount();
      });
    }
  }

  calculateAmount() {
    const adults = this.form.get('total_adults')?.value || 0;
    const children = this.form.get('total_children')?.value || 0;
    const childEquivalent = Math.floor(children / 2); // 2 children = 1 adult
    this.calculatedAmount = (adults + childEquivalent) * this.packagePrice;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue(); // gets disabled values too

    const payload: Booking = {
      user_id: this.auth.getUserId(),
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      total_adults: formValue.total_adults,
      total_children: formValue.total_children,
      start_date: formValue.start_date,
      package_id: this.packageId!,
      status: 'pending',
      amt_paid: this.calculatedAmount // ✅ include calculated amount
    };

    const action = this.isEdit && this.bookingId
      ? this.api.updateBooking(this.bookingId, payload)
      : this.api.createBooking(payload);

    action.subscribe(() => this.router.navigate(['/bookings']));
  }

  get f() {
    return this.form.controls;
  }
}
