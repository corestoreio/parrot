import { Component, Input } from '@angular/core';
import { ProjectsService } from './../projects.service';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
    @Input()
    onSubmit;
}
