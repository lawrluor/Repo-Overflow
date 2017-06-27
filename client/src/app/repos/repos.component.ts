import { Component, OnInit } from '@angular/core';
import { RepoService } from '../repo.service'; // import data manipulation service
import { Repo } from '../repo'; // import Repo Schema

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css'],
  providers: [RepoService] // allow imported service to be injected
})
export class ReposComponent implements OnInit {
  // declare vars
  repos: Repo[];
  repo: Repo;
  name: string;
  url: string;
  description: string;
  owner: string;
  avatar: string;

  // dependency injection: provide service
  constructor(private repoService: RepoService) { }

  // retrieve data - called each time browser is loaded
  ngOnInit() {
    this.repoService.getRepos()
      .subscribe(repos => this.repos = repos);
  }

}
