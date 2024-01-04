import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseURL = environments.baseURL;
    private user?:User;

    constructor(private http:HttpClient) { }

    get currentUser()
    :User|undefined{
        if(!this.user) return undefined;
        return structuredClone(this.user);
    }

    login(user:string, password:string):Observable<User>{

        return this.http.get<User>(`${this.baseURL}/users/1`)
            .pipe(
                tap((user) => this.user = user),
                tap((user) => localStorage.setItem('token', "asfasj32j28a7ghasf98324"))
            )
    }

    logout(){
        this.user = undefined;
        localStorage.clear();
    }

    checkAuthentication():Observable<boolean>{
        if(!localStorage.getItem('token')) return of(false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(`${this.baseURL}/users/1`)
            .pipe(
                tap((user) => this.user = user),
                map((user) => !!user),
                catchError((err) => of(false))
            )
    }
    
}