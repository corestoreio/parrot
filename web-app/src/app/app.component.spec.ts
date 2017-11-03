
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TestModule } from './../testing-helpers';


import { AppComponent } from './app.component';


describe('AppComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
            imports: [ RouterTestingModule, TestModule ]
        }).overrideComponent( AppComponent,{
            set:{
                template: `
                    <span>{{ title }}</span>
                    <section class="main">
                        <router-outlet></router-outlet>
                    </section>
                `
            }
        } ).compileComponents();


    }));

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'Parrot'`, async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('Parrot');
    }));
});
