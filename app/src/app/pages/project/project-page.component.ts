import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalesService } from './../../locales/services/locales.service';

@Component({
    providers: [LocalesService],
    selector: 'project-page',
    templateUrl: 'project-page.component.html'
})
export class ProjectPage implements OnInit {
    ngOnInit() {

    }
}