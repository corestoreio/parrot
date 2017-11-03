import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Parrot';

  constructor(private router: Router, translate: TranslateService) {
    translate.setDefaultLang('en-US');
  }

  ngOnInit() { }
}
