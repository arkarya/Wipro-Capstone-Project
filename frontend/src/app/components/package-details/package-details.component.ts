import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from 'src/app/models/package/package.module';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent {
  pkg?: Package;
  loading = false;
  isAdmin = false; // Simulated admin check

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    // Admin role check (without JWT)
    this.isAdmin = this.auth.isAdmin;

    this.api.getPackage(id).subscribe({
      next: (p) => {
        this.pkg = p;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  book() {
    if (this.pkg) {
      this.router.navigate(['/booking/new', this.pkg.id]);
    }
  }

  editPackage() {
    if (this.pkg) {
      this.router.navigate(['/packages/edit', this.pkg.id]);
    }
  }

  deletePackage() {
    if (this.pkg && confirm('Are you sure you want to delete this package?')) {
      this.api.deletePackage(this.pkg.id).subscribe({
        next: () => {
          alert('Package deleted successfully.');
          this.router.navigate(['/packages']);
        },
        error: () => alert('Failed to delete the package.'),
      });
    }
  }

  addPackage() {
    this.router.navigate(['/packages/new']);
  }
}
