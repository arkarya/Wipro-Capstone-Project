import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private url = 'http://localhost:5000/api/packages'; // Gateway endpoint
  
  constructor(private http: HttpClient) {}

  addPackage(pkg: any): Observable<any> {
    return this.http.post(`${this.url}`, pkg);
  }

  getPackages(): Observable<any> {
    return this.http.get(this.url);
  }
}
