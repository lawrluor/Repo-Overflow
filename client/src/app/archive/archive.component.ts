import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../archive.service'; // import data manipulation service
import { Repo } from '../repo'; // import Repo Schema

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [ArchiveService] // registers service for use
})
export class ArchiveComponent implements OnInit {
  // declare Repo vars
  repos: Repo[]; // array of Repo objects
  repo: Repo; // Repo schema
  name: string;
  url: string;
  description: string;
  owner: string;
  avatar: string;

  // dependency injection: provide service
  constructor(private archiveService: ArchiveService) { }

  // retrieve Repo data from api/repositories - called each time browser is loaded
  ngOnInit() {
    this.archiveService.getArchive()
      .subscribe(repos => this.repos = repos);
  }
}
