import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}
  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken'); // Check for token existence.
    if (token) {
      return true; // Allow route activation if token exists.
    } else {
      this.router.navigate(['/login']); // Redirect to login if token is missing.
      return false; // Deny access to the route.
    }
  }
  
}
