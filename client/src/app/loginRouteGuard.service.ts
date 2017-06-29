import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'; // import HTTP methods for CRUD


@Injectable()
export class LoginRouteGuard {

  constructor(private http: Http) {} // construct user

  // When canActivate is true, user can activate route. When canActivate returns false, user cannot access route.
  canActivate() {
    // console.log(this.isLoggedIn()); // check if user logged in
    return this;
  }
}
