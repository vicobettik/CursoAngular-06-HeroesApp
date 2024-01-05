import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, CanMatch, CanMatchFn, Route, UrlSegment, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{
    constructor(private authservice:AuthService,
                private router:Router) { }

    private checkAuthStatus(): boolean | Observable<boolean>{
        return this.authservice.checkAuthentication()
            .pipe(
                tap((isAuthenticated) => {
                    if (!isAuthenticated) {
                        this.router.navigate(['/auth/login']);
                    }
                })
            )
    }

    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean>  {
        // console.log('canmatch')
        // console.log(route, segments)
        return this.checkAuthStatus();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>{
        // console.log('canactivate')
        // console.log(route, state)
        return this.checkAuthStatus();
    }
    
}