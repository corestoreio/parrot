import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TestModule } from './../../../testing-helpers';
import { RegisterComponent, AuthService } from './../index';
import { ErrorsService } from './../../shared/errors.service';


describe('Register Component', () => {
    let fixture: ComponentFixture<RegisterComponent>,
    comp: RegisterComponent,
    authService,
    errorService,
    router,
    errorElement,
    userModel = {
        email: 'test@testdomain.com',
        password: 'testpass',
        name: 'testUser',
        wrongMail: 'error@testdomain.com',
    };

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule
            ],
            declarations:[
                RegisterComponent
            ]
        }).compileComponents();
    });


    beforeEach (() => {
        fixture = TestBed.createComponent( RegisterComponent );
        comp = fixture.debugElement.componentInstance;
        errorService = fixture.debugElement.injector.get( ErrorsService );
        authService = fixture.debugElement.injector.get( AuthService );
        router = fixture.debugElement.injector.get( Router );
    });


    it('should create component', () => {
        expect( comp ).toBeTruthy();
    });

    it( 'should navigate to login', () => {
        spyOn( router, 'navigate' );

        comp.navigateToLogin();
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith( ['/login'] );
    } );

    it('should succesfully register', async( () => {
        spyOn( authService, 'register' ).and.callThrough();
        spyOn( router, 'navigate' );
        spyOn( errorService, 'mapErrors' );

        comp.onSubmit( userModel.name, userModel.email, userModel.password );
        fixture.detectChanges();
        errorElement = fixture.debugElement.query(By.css('.message-body'));

        expect( errorElement ).toEqual(null);
        expect( errorService.mapErrors ).not.toHaveBeenCalled();
        expect( router.navigate ).toHaveBeenCalledWith( ['/projects'] );

    }));

    it('should throw error', async( () => {
        spyOn( authService, 'register' ).and.callThrough();
        spyOn( errorService, 'mapErrors' ).and.callThrough();
        spyOn( router, 'navigate' );

        comp.onSubmit( userModel.name, userModel.wrongMail, userModel.password );
        fixture.detectChanges();
        errorElement = fixture.debugElement.query(By.css('.message-body'));

        expect( errorElement ).not.toEqual( null );
        expect( errorService.mapErrors ).toHaveBeenCalled();
    }) );

});

