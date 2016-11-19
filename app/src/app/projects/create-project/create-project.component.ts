import { Component, Input } from '@angular/core';

import { ProjectsService } from './../services/projects.service';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {
    @Input()
    onSubmit;
}
