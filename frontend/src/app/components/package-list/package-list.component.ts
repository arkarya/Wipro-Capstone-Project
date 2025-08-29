import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Package } from '../../models/package/package.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
})
export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  query = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  

showError(message: string) {
  this.error = message;
 // Hide after 5 seconds
}

  load() {
    this.loading = true;
    this.api.listPackages(this.query).subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to load packages';
        setTimeout(() => {
        this.error = '';
        }, 5000);
        this.loading = false;
        console.log(e)
      },
    });
  }
  onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/placeholder.png';
}

  view(pkg: Package) {
    this.router.navigate(['/package', pkg.id]);
  }
}
