import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Parrot';

  constructor(private router: Router) { }

  ngOnInit() { }

  sidenavVisible() {
    // Match nested routes of /projects/*
    return this.router.url.match(/projects\/[\w\d].*/);
  }
}
