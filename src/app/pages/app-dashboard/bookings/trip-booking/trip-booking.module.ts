import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripBookingPageRoutingModule } from './trip-booking-routing.module';

import { TripBookingPage } from './trip-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TripBookingPageRoutingModule
  ],
  declarations: [TripBookingPage]
})
export class TripBookingPageModule {}
