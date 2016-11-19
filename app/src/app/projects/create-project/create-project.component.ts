import { Component, Input } from '@angular/core';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html'
})
export class CreateProjectComponent {
    @Input()
    onSubmit;
}
