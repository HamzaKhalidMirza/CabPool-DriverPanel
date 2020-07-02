import { AuthService } from './../../../common/sdk/core/auth.service';
import { Router } from '@angular/router';
import { Coordinates } from "./../../../common/model/placeLocation.model";
import { LocationPickerModalComponent } from "./shared/modals/location-picker-modal/location-picker-modal.component";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-app-dashboard",
  templateUrl: "./app-dashboard.page.html",
  styleUrls: ["./app-dashboard.page.scss"],
})
export class AppDashboardPage implements OnInit {
  center: Coordinates;

  constructor(
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.geolocation
      .getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.center = coordinates;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openLocationPickerModal() {
    this.modalCtrl
      .create({
        component: LocationPickerModalComponent,
        componentProps: {
          currentLocation: this.center,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then(async (locationData) => {
          if(locationData) {
            await this.authService.setFieldDataToStorage('source', locationData.data[0]);
            await this.authService.setFieldDataToStorage('dest', locationData.data[1]);
            this.router.navigate(['/app-dashboard/trip-booking']);
          }
        });
      });
  }
}
