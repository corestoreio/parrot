import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TestModule } from './../../../testing-helpers';
import { LoginComponent, AuthService } from './../index';
import { ErrorsService } from './../../shared/errors.service';

describe('Login Component', () => {
    let fixture: ComponentFixture<LoginComponent>,
    comp: LoginComponent,
    authService,
    errorService,
    router,
    errorElement;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [
                TestModule
            ],
            declarations:[
                LoginComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent( LoginComponent );
        comp = fixture.debugElement.componentInstance;
        errorService = fixture.debugElement.injector.get( ErrorsService );
        authService = fixture.debugElement.injector.get( AuthService );
        router = fixture.debugElement.injector.get( Router );

    });

    it('should create the component', async( () => {
        expect( comp ).toBeTruthy();
    }));


    it('should throw an error', async( () => {
        spyOn( authService, 'login' ).and.callThrough();
        spyOn( errorService, 'mapErrors' ).and.callThrough();
        spyOn( router, 'navigate' );

        comp.onSubmit('test@testdomains.com', 'testpass');
        fixture.detectChanges();
        errorElement = fixture.debugElement.query(By.css('.message-body'));

        expect( errorElement ).not.toEqual( null );
        expect( errorService.mapErrors ).toHaveBeenCalled();
    }));


    it('should successfully login', async( () => {
        spyOn( authService, 'login' ).and.callThrough();
        spyOn( router, 'navigate' );
        spyOn( errorService, 'mapErrors' );

        comp.onSubmit( 'test@testdomain.com', 'testpass' );
        fixture.detectChanges();
        errorElement = fixture.debugElement.query(By.css('.message-body'));

        expect( errorElement ).toEqual(null);
        expect( errorService.mapErrors ).not.toHaveBeenCalled();
        expect( router.navigate ).toHaveBeenCalledWith(['/projects']);
    }));


    it( 'should navigate to registaration', () => {
        spyOn( router, 'navigate' );

        comp.navigateToRegister();

        expect( router.navigate ).toHaveBeenCalledWith(['/register']);
    } );
});
