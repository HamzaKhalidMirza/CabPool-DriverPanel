import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripBookingPage } from './trip-booking.page';

describe('TripBookingPage', () => {
  let component: TripBookingPage;
  let fixture: ComponentFixture<TripBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripBookingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
