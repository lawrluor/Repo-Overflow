import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../archive.service'; // import data manipulation service
import { RepoService } from '../repo.service';
import { Repo } from '../repo'; // import Repo Schema

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [ArchiveService, RepoService] // registers service for use
})
export class ArchiveComponent implements OnInit {
  message = '';

  // dependency injection: provide service
  constructor(private archiveService: ArchiveService) { }

  // retrieve Repo data from api/repositories - called each time browser is loaded
  ngOnInit() {
    this.archiveService.getArchive()
      .subscribe(message => this.message = message);
  }
}
