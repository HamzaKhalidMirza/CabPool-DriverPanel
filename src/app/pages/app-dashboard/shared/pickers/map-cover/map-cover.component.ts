import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { Plugins, Capacitor } from "@capacitor/core";
import {
  PlaceLocation,
  Coordinates,
} from "src/common/model/placeLocation.model";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-map-cover",
  templateUrl: "./map-cover.component.html",
  styleUrls: ["./map-cover.component.scss"],
})
export class MapCoverComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("map") mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;
  center: any;

  constructor(
    private baseMapService: BaseMapService,
    private alertCtrl: AlertController,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    if (!Capacitor.isPluginAvailable("Geolocation")) {
      this.showMapsErrorAlert();
      return;
    }
    Plugins.Geolocation.getCurrentPosition()
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

  ngAfterViewInit(): void {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
          disableDefaultUI: true, // a way to quickly hide all controls,,
          scaleControl: true,
          zoomControl: true,
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        const marker = new googleMaps.Marker({
          position: this.center,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }
}
