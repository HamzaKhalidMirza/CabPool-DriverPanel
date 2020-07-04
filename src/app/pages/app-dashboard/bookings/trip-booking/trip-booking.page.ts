import { TripService } from './../../../../../common/sdk/custom/api/trip.service';
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { AuthService } from "./../../../../../common/sdk/core/auth.service";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Location } from "@angular/common";
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
import { LoadingController, ModalController, AlertController } from "@ionic/angular";
import { LocationPickerModalComponent } from '../../shared/modals/location-picker-modal/location-picker-modal.component';

@Component({
  selector: "app-trip-booking",
  templateUrl: "./trip-booking.page.html",
  styleUrls: ["./trip-booking.page.scss"],
})
export class TripBookingPage implements OnInit {

  @ViewChild("map") mapElementRef: ElementRef;
  sourceLocation: any;
  destLocation: any;
  center: any;
  seatsCounter: number = 1;
  googleMapsSdk: any;
  tripBookingForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private location: Location,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private baseMapService: BaseMapService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
  }

  async ngOnInit() {
    this.formInitializer();

    this.sourceLocation = await this.authService.getFieldDataFromStorage("source");
    this.destLocation = await this.authService.getFieldDataFromStorage("dest");
    this.center = await this.authService.getFieldDataFromStorage("center");
    await this.authService.clearFieldDataFromStorage("source");
    await this.authService.clearFieldDataFromStorage("dest");
    await this.authService.clearFieldDataFromStorage("center");

    this.createMap();

    this.tripBookingForm.patchValue({
      startLocation: {
        coordinates: [this.sourceLocation.lat, this.sourceLocation.lng],
        address: this.sourceLocation.address
      }
    });
    this.tripBookingForm.patchValue({
      endLocation: {
        coordinates: [this.destLocation.lat, this.destLocation.lng],
        address: this.destLocation.address
      }
    });
    this.tripBookingForm.patchValue({seatsAvailable: this.seatsCounter});
  }

  formInitializer() {
    this.tripBookingForm = this.formBuilder.group({
      startDate: ["",Validators.required],
      startTime: ["",Validators.required],
      description: new FormControl(null),
      seatsAvailable: new FormControl(null),
      totalSeats: new FormControl(null),
      startLocation: new FormControl(null),
      endLocation: new FormControl(null),
    });
    this.tripBookingForm.reset();
  }

  createMap() {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
        console.log("Google Maps", googleMapsSdk);
        this.googleMapsSdk = googleMapsSdk;
        var start = new googleMapsSdk.LatLng(this.sourceLocation.lat, this.sourceLocation.lng);
        var end = new googleMapsSdk.LatLng(this.destLocation.lat, this.destLocation.lng);

        this.mapElementRef.nativeElement.hidden = false;
        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMapsSdk.Map(mapEl, {
          center: start,
          zoom: 14,
          disableDefaultUI: true,
          scaleControl: true,
          zoomControl: true,
          mapTypeId: "roadmap",
        });

        this.googleMapsSdk.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
        });

        let sourceMarker = new googleMapsSdk.Marker({
          position: start,
          icon: "assets/icon/car.png",
          map: map,
          title: "Picked Location",
        });

        let destMarker = new googleMapsSdk.Marker({
          position: end,
          icon: "assets/icon/car.png",
          map: map,
          title: "Destination Location",
        });

        let directionsService = new googleMapsSdk.DirectionsService();
        let directionsDisplay = new googleMapsSdk.DirectionsRenderer();
        directionsDisplay.setMap(map);

        var bounds = new googleMapsSdk.LatLngBounds();
        // bounds.extend(start);
        // bounds.extend(end);
        map.fitBounds(bounds);
        var request = {
          origin: start,
          destination: end,
          travelMode: googleMapsSdk.TravelMode.DRIVING,
        };
        directionsService.route(request, function (response, status) {
          if (status == googleMapsSdk.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
          } else {
            alert(
              "Directions Request from " +
                start.toUrlValue(6) +
                " to " +
                end.toUrlValue(6) +
                " failed: " +
                status
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openMapPickerModal() {
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
          if(locationData.data != null) {
            this.sourceLocation = locationData.data[0];
            this.destLocation = locationData.data[1];
            this.createMap();

            this.tripBookingForm.patchValue({
              startLocation: {
                coordinates: [this.sourceLocation.lat, this.sourceLocation.lng],
                address: this.sourceLocation.address
              }
            });
            this.tripBookingForm.patchValue({
              endLocation: {
                coordinates: [this.destLocation.lat, this.destLocation.lng],
                address: this.destLocation.address
              }
            });
            this.tripBookingForm.patchValue({seatsAvailable: this.seatsCounter});
          }
        });
      });
  }

  onCreateTrip() {
    if (this.tripBookingForm.invalid) {
      return;
    }
    this.tripBookingForm.patchValue({totalSeats: this.seatsCounter});
    this.loadingCtrl.create({}).then( async (loadingEl) => {
      loadingEl.present();

      const createTripObservable = await this.tripService
      .createTrip(this.tripBookingForm.value);

      createTripObservable.subscribe(
        async (response) => {
            loadingEl.dismiss();
            this.tripBookingForm.reset();
            this.seatsCounter = 1;
            this.sourceLocation = null;
            this.destLocation = null;
            this.mapElementRef.nativeElement.hidden = true;

            this.alertCtrl
            .create({
              header: "Trip Created Successfully!",
              buttons: ["Okay"],
            })
            .then((alertEl) => alertEl.present());
      
        },
        (error: AppError) => {
          loadingEl.dismiss();
          if (error instanceof BadInput) {
            console.log("error B", error);
          } else if (error instanceof NotFoundError) {
            console.log("error N", error);
          } else if (error instanceof UnAuthorized) {
            console.log("error U", error);
          } else {
            console.log("error", error);
          }
        }
      );
    });
  }
  
  goBack() {
    this.location.back();
  }

  incrementSeat() {
    if (this.seatsCounter === 4) {
      return;
    }
    this.seatsCounter++;
    this.tripBookingForm.patchValue({seatsAvailable: this.seatsCounter});
  }

  decrementSeat() {
    if (this.seatsCounter === 1) {
      return;
    }
    this.seatsCounter--;
    this.tripBookingForm.patchValue({seatsAvailable: this.seatsCounter});
  }

}
