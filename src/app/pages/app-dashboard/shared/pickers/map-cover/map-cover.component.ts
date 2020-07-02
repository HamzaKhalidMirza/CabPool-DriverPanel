import { BaseMapService } from 'src/common/sdk/custom/maps/baseMap.service';
import { Coordinates } from './../../../../../../common/model/placeLocation.model';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from '@ionic/angular';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-map-cover",
  templateUrl: "./map-cover.component.html",
  styleUrls: ["./map-cover.component.scss"],
})
export class MapCoverComponent implements OnInit, AfterViewInit {

  @ViewChild("map") mapElementRef: ElementRef;
  center: Coordinates | any;
  googleMapsSdk: any;

  constructor(
    private renderer: Renderer2,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    private baseMapService: BaseMapService
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.geolocation
    .getCurrentPosition()
    .then((geoPosition) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude,
      };
      this.center = coordinates;
      console.log("Coords", this.center);

      this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        console.log("Google Maps", googleMapsSdk);
        this.googleMapsSdk = googleMapsSdk;
        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMapsSdk.Map(mapEl, {
          center: this.center,
          zoom: 15,
          disableDefaultUI: true,
          scaleControl: true,
          zoomControl: true,
          mapTypeId: 'roadmap'
        });

        this.googleMapsSdk.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });

        new googleMapsSdk.Marker({
          position: this.center,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
      this.showMapsErrorAlert();
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
