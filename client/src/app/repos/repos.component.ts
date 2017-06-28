import { Component, OnInit } from '@angular/core';
import { RepoService } from '../repo.service'; // import data manipulation service
import { Repo } from '../repo'; // import Repo Schema

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html', // loads this HTML file, and passes variables to it under export ReposComponent
  styleUrls: ['./repos.component.css'],
  providers: [RepoService] // allow imported service to be injected
})

export class ReposComponent implements OnInit {
  // declare vars
  repos: Repo[]; // array of Repo objects
  repo: Repo;
  name: string;
  url: string;
  description: string;
  owner: string;
  avatar: string;

  // dependency injection: provide service
  constructor(private repoService: RepoService) { }

  // retrieve Repo data from api/repositories - called each time browser is loaded
  ngOnInit() {
    this.repoService.getRepos() // repoService in repo.service.ts calls localhost:3000/api/repositories for data
      .subscribe(repos => this.repos = repos);
  }
}
