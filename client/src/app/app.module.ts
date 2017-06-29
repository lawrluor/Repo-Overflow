import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ReposComponent } from './repos/repos.component';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './archive/archive.component';

// Routes in Angular: on path, 'http://locahost:4200' + /path, load respective component
// Reference: https://angular.io/guide/router
const appRoutes: Routes = [
  { path: 'repositories', component: ReposComponent },
  { path: 'auth/archive', component: ArchiveComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ReposComponent,
    ArchiveComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes) //
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
