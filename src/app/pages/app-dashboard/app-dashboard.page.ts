import { LocationPickerModalComponent } from "./shared/modals/location-picker-modal/location-picker-modal.component";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import {
  PlaceLocation,
  Coordinates,
} from "../../../common/model/placeLocation.model";
import { ModalController, AlertController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-app-dashboard",
  templateUrl: "./app-dashboard.page.html",
  styleUrls: ["./app-dashboard.page.scss"],
})
export class AppDashboardPage implements OnInit, AfterViewInit, OnDestroy {
  center: any;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private geolocation: Geolocation
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
        console.log("Coords", this.center);
      })
      .catch((err) => {
        console.log(err);
        this.showMapsErrorAlert();
      });
  }

  ngAfterViewInit() {}

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }

  ngOnDestroy(): void {}

  openLocationPickerModal() {
    this.modalCtrl
      .create({ 
        component: LocationPickerModalComponent,
        componentProps: {
          'currentLocation': this.center
        }
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
