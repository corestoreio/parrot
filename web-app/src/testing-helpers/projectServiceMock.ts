import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from './../app/projects/model/project'
import 'rxjs/add/observable/of';

@Injectable()
export class ProjectServiceMock{
    public projectMock: Project = {
        name: 'Test Project',
        keys: [],
        id: 'test-project'
    }
    createProject( project ){
        project = this.projectMock;
        return Observable.of(project);
    }

    fail(){
        throw new Error('no project in res');
    }
}