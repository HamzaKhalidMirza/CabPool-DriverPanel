import { TripService } from './../../../../../../common/sdk/custom/api/trip.service';
import { BaseMapService } from 'src/common/sdk/custom/maps/baseMap.service';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {format} from "date-fns";

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.page.html',
  styleUrls: ['./trip-detail.page.scss'],
})
export class TripDetailPage implements OnInit {

  @ViewChild("map") mapElementRef: ElementRef;
  center: any;
  sourceLocation: any;
  destLocation: any;
  googleMapsSdk: any;
  isLoading: any;
  loadedTrip: any;

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private baseMapService: BaseMapService,
    private route: ActivatedRoute,
    private tripService: TripService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( async (router) => {
      let tripId = router.get('tridId');
      this.isLoading = true;
      const getTripObservable = await this.tripService.getCurrentDriverSingleTrip({
        tripId
      });
  
      getTripObservable.subscribe(
        async (response: any) => {
          this.isLoading = false;
          console.log(response);
          this.loadedTrip = response.data.data;
          this.sourceLocation = {
            lat: this.loadedTrip.startLocation.coordinates[0],
            lng: this.loadedTrip.startLocation.coordinates[1],
            address: this.loadedTrip.startLocation.address
          };
          this.destLocation = {
            lat: this.loadedTrip.endLocation.coordinates[0],
            lng: this.loadedTrip.endLocation.coordinates[1],
            address: this.loadedTrip.endLocation.address
          };
          this.createMap();
        },
        (error: AppError) => {
          this.isLoading = false;
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

  createMap() {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMapsSdk: any) => {
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

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'hh:mm a');
  }

  goBack() {
    this.location.back();
  }

}
