import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './../services/auth.service';
import { User } from './../../users/model/user';
import { ErrorsService } from './../../shared/errors.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  public errors: string[];
  public language: string;
  public languages = [
    { value: 'en-US', name: 'English' },
    { value: 'zh-CN', name: '中文' }
  ];
  constructor(private auth: AuthService, private router: Router, private errorsService: ErrorsService, private translate: TranslateService) { }

  ngOnInit() {
    let browLang = this.translate.getBrowserCultureLang();
    if (this.languages.filter(item => item.value === browLang).length > 0) {
      this.language = browLang;
      this.translate.use(this.language);
    } else {
      this.language = "en-US";
      this.translate.use(this.language);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit(email: string, password: string) {
    let user = { email: email, password: password };
    this.auth.login(user).subscribe(
      result => {
        this.router.navigate(['/projects']);
      },
      err => this.errors = this.errorsService.mapErrors(err, 'Login'));
  }

  onChangeLanguage(language: string) {
    this.translate.use(language);
  }
}
