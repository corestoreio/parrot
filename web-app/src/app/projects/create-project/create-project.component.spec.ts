import { TestBed, fakeAsync, async, tick, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import{ CreateProjectComponent, ProjectsService } from './../index';
import { Project } from './../model/project';
import { TestModule } from './../../../testing-helpers';

describe('Create Project Component', () => {
    let fixture: ComponentFixture<CreateProjectComponent>,
    comp: CreateProjectComponent,
    projectService,
    modal,
    project: Project = {
        id: '',
        name: '',
        keys: []
    };

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule
            ],
            declarations:[
                CreateProjectComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent( CreateProjectComponent );
        comp = fixture.debugElement.componentInstance;
        projectService = fixture.debugElement.injector.get( ProjectsService );
    });

     it('should create the component', () => {
        expect( comp ).toBeTruthy();
    });


    it('should open the modal', () => {
        comp.openModal();
        modal = fixture.debugElement.query(By.css('.modal'));

        fixture.detectChanges();

        expect( comp.modalOpen ).toEqual(true);
        expect( modal.nativeElement.getAttribute('class') ).toContain('is-active');
    });

    it('should close the modal', () => {
        comp.closeModal();
        modal = fixture.debugElement.query(By.css('.modal'));

        fixture.detectChanges();

        expect(comp.modalOpen).toEqual(false);
        expect( modal.nativeElement.getAttribute('class') ).not.toContain('is-active');
    });

    it('should reset the project model', () =>{
        comp.resetProject();
        expect( comp.project ).toEqual(project);

    });

    it('should close modal & stop loading after submiting project form', async(() =>{
        let closeModalSpy = spyOn(comp, 'closeModal');
        spyOn(projectService, 'createProject').and.callThrough();
        
        comp.createProject(); 

        expect(closeModalSpy).toHaveBeenCalled();
        expect(comp.loading).toBe(false);
    }));

});