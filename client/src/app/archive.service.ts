// This service will handle loading calls from backend to display archive pages
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'; // import HTTP methods for CRUD
import 'rxjs/add/operator/map';

@Injectable()
export class ArchiveService {

  constructor(private http: Http) { }

  // get data from backend database by calling API using API url
  getArchive(){
    return this.http.get('http://localhost:3000/api/archive')
      .map(res => res.json()); // map to JSON format
  }

}

// exports ArchiveService as variable for use in repos.component.ts
