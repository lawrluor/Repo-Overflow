// This service will handle getting data from our database, and will be injected into repos.component.ts
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'; // import HTTP methods for CRUD
import { Repo } from './repo'; // to import Schema
import 'rxjs/add/operator/map';

@Injectable()
export class RepoService {

  constructor(private http: Http) { }

  // get data from backend database by calling API using API url
  getRepos(){
    return this.http.get('http://localhost:3000/api/repositories')
      .map(res => res.json()); // map to JSON format
  }

}

// exports RepoService as variable for use in repos.component.ts
