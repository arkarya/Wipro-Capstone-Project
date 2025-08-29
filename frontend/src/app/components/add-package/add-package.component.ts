import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css']
})
export class AddPackageComponent implements OnInit {
  packageForm: FormGroup;
  submitting = false;
  isEditMode = false;
  packageId?: number;

  message: string = '';
  messageType: 'success' | 'error' = 'success';
  private messageTimeout: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      destination: ['', Validators.required],
      country: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration_days: [1, [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      total_slots: [0, [Validators.required, Validators.min(0)]],
      available_slots: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image_url1: [''],
      image_url2: [''],
      image_url3: ['']
    });
  }

  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.packageId) {
      this.isEditMode = true;
      this.loadPackage(this.packageId);
    }
  }

  loadPackage(id: number) {
    this.api.getPackage(id).subscribe(pkg => {
      this.packageForm.patchValue({
        name: pkg.name,
        type: pkg.type,
        destination: pkg.destination,
        country: pkg.country,
        price: pkg.price,
        duration_days: pkg.duration_days,
        start_date: pkg.start_date,
        total_slots: pkg.total_slots,
        available_slots: pkg.available_slots,
        description: pkg.description,
        image_url1: pkg.image_url1,
        image_url2: pkg.image_url2,
        image_url3: pkg.image_url3
      });
    });
  }

  submit() {
    if (this.packageForm.invalid) return;

    this.submitting = true;
    this.message = '';

    const packageData = this.packageForm.value;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.submitting = false;
      this.showMessage('User not logged in.', 'error');
      return;
    }

    const payload = {
      ...packageData,
      user_id: userId
    };

    if (this.isEditMode && this.packageId) {
      this.api.updatePackage(this.packageId, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.showMessage('Package updated successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/packages']);
          }, 1500); // wait 1.5 seconds before redirecting
        },
        error: () => {
          this.submitting = false;
          this.showMessage('Failed to update package.', 'error');
        }
      });
    } else {
      this.api.createPackage(payload).subscribe({
        next: (newPkg) => {
          this.submitting = false;
          this.showMessage('Package added successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/packages']);
          }, 1500); // wait 1.5 seconds before redirecting
        },
        error: () => {
          this.submitting = false;
          this.showMessage('Failed to add package.', 'error');
        }
      });
    }
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    this.messageTimeout = setTimeout(() => {
      this.message = '';
    }, 4000); // Hide message after 4 seconds
  }
}
