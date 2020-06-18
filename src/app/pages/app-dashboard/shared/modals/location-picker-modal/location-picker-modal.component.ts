import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { ModalController } from "@ionic/angular";
import { ElementRef, Input } from "@angular/core";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

declare var google;

@Component({
  selector: "app-location-picker-modal",
  templateUrl: "./location-picker-modal.component.html",
  styleUrls: ["./location-picker-modal.component.scss"],
})
export class LocationPickerModalComponent implements OnInit {
  @ViewChild("editFromIcon") editFromIcon: ElementRef;
  @ViewChild("closeFromIcon") closeFromIcon: ElementRef;
  @ViewChild("editWhereIcon") editWhereIcon: ElementRef;
  @ViewChild("closeWhereIcon") closeWhereIcon: ElementRef;

  @Input("center") currentLocation;
  googleMaps: any;

  sourceLoading: any;
  sourceLocations: any = [];
  selectedSourceLocation: any;

  destinationLoading: any;
  destinationLocations: any = [];
  selectedDestinationLocation: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private baseMapService: BaseMapService
  ) {}

  ngOnInit() {}

  onInputFrom(value) {
    this.sourceLocations = [];
    this.destinationLocations = [];

    if (value === "") {
      this.closeFromIcon.nativeElement.style.display = "none";
      this.editFromIcon.nativeElement.style.display = "block";
    } else {
      this.closeFromIcon.nativeElement.style.display = "block";
      this.editFromIcon.nativeElement.style.display = "none";
      this.sourceLoading = true;

      this.baseMapService
        .getGoogleMapsSdk()
        .then((googleMaps: any) => {
          // console.log("Google Maps Place Sdk", googleMaps);
          this.googleMaps = googleMaps;

          let myLatLng = new googleMaps.LatLng({
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
          });
          let service = new googleMaps.places.AutocompleteService();
          service.getQueryPredictions(
            {
              input: value,
              components: "country:pk",
              location: myLatLng,
              radius: "500",
            },
            (locations) => {
              this.sourceLoading = false;
              this.sourceLocations = locations;
              // console.log('Locations', locations);
              // console.log('Source Locations', this.sourceLocations);
            }
          );
        })
        .catch((err) => {
          this.sourceLoading = false;
          console.log(err);
        });
    }
  }

  onInputWhere(value) {
    this.sourceLocations = [];
    this.destinationLocations = [];

    if (value === "") {
      this.closeWhereIcon.nativeElement.style.display = "none";
      this.editWhereIcon.nativeElement.style.display = "block";
    } else {
      this.closeWhereIcon.nativeElement.style.display = "block";
      this.editWhereIcon.nativeElement.style.display = "none";
      this.destinationLoading = true;

      this.baseMapService
        .getGoogleMapsSdk()
        .then((googleMaps: any) => {
          // console.log("Google Maps Place Sdk", googleMaps);
          this.googleMaps = googleMaps;

          let myLatLng = new googleMaps.LatLng({
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
          });
          let service = new googleMaps.places.AutocompleteService();
          service.getQueryPredictions(
            {
              input: value,
              components: "country:pk",
              location: myLatLng,
              radius: "500",
            },
            (locations) => {
              this.destinationLoading = false;
              this.destinationLocations = locations;
              // console.log(locations);
            }
          );
        })
        .catch((err) => {
          this.destinationLoading = false;
          console.log(err);
        });

    }
  }

  closeFromText() {
    this.sourceLocations = [];
    this.destinationLocations = [];
    this.closeFromIcon.nativeElement.style.display = "none";
    this.editFromIcon.nativeElement.style.display = "block";
    let fromInput: any = document.getElementById("fromInputEl");
    fromInput.value = "";
  }

  closeWhereText() {
    this.sourceLocations = [];
    this.destinationLocations = [];
    this.closeWhereIcon.nativeElement.style.display = "none";
    this.editWhereIcon.nativeElement.style.display = "block";
    let fromInput: any = document.getElementById("fromWhereEl");
    fromInput.value = "";
  }

  onBlurFrom() {
    console.log('OnBlurFrom Hi');
    this.sourceLocations = [];
    this.destinationLocations = [];

    this.sourceLoading = false;
    this.destinationLoading = false;
  }

  onBlurwhere() {
    console.log('OnBlurWhere Hi');
    this.sourceLocations = [];
    this.destinationLocations = [];

    this.sourceLoading = false;
    this.destinationLoading = false;
  }

  onFocusFrom() {
    let fromInput: any = document.getElementById('fromInputEl');
    fromInput.getInputElement()
    .then(nativeInputEl => {
      nativeInputEl.select();
    });
  }

  onFocusWhere() {
    let fromInput: any = document.getElementById('whereInputEl');
    fromInput.getInputElement()
    .then(nativeInputEl => {
      nativeInputEl.select();
    });
  }

  onSelectionSourceLocation(location) {
    console.log(location);
    this.selectedSourceLocation = location;
  }

  goBack() {
    this.modalCtrl.dismiss();
  }
}
