import { AuthService } from "./../../../../../common/sdk/core/auth.service";
import { Component, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-trip-booking",
  templateUrl: "./trip-booking.page.html",
  styleUrls: ["./trip-booking.page.scss"],
})
export class TripBookingPage implements OnInit {
  sourceLocation: any;
  destLocation: any;
  seatsCounter: number = 1;

  constructor(
    private authService: AuthService,
    private location: Location,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
    ) {}

  async ionViewWillEnter() {
    this.sourceLocation = await this.authService.getFieldDataFromStorage("source");
    this.destLocation = await this.authService.getFieldDataFromStorage("dest");
    await this.authService.clearFieldDataFromStorage("source");
    await this.authService.clearFieldDataFromStorage("dest");
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  incrementSeat() {
    if(this.seatsCounter === 4) {
      return;
    }
    this.seatsCounter++;
  }

  decrementSeat() {
    if(this.seatsCounter === 1) {
      return;
    }
    this.seatsCounter--;
  }
}
