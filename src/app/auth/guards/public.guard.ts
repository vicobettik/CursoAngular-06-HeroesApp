import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, RouterStateSnapshot, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanActivate, CanMatch{

    constructor(private authService:AuthService,
                private router:Router) { }
    
    checkAuthentication(): boolean | Observable<boolean> {
        return this.authService.checkAuthentication()
            .pipe(
                tap((isAuthenticated) => {
                    this.router.navigate(['/heroes']);
                }),
                map((isAuthenticated) => !isAuthenticated)
            )
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // throw new Error('Method not implemented.');
        return this.checkAuthentication();
    }
    canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // throw new Error('Method not implemented.');
        return this.checkAuthentication();
    }
    
}