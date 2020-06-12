import { LocationPickerModalComponent } from "./shared/modals/location-picker-modal/location-picker-modal.component";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Plugins, Capacitor } from "@capacitor/core";
import {
  PlaceLocation,
  Coordinates,
} from "../../../common/model/placeLocation.model";
import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-app-dashboard",
  templateUrl: "./app-dashboard.page.html",
  styleUrls: ["./app-dashboard.page.scss"],
})
export class AppDashboardPage implements OnInit, AfterViewInit, OnDestroy {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  openLocationPickerModal() {
    this.modalCtrl
      .create({ component: LocationPickerModalComponent })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
