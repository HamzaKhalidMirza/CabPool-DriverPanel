import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import {
  Component,
  OnInit,
  Input,
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
  clickListener: any;
  googleMaps: any;
  @Input() center: any;

  constructor(
    private baseMapService: BaseMapService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.baseMapService
      .getGoogleMapsSdk()
      .then((googleMaps: any) => {
        console.log("Google Maps", googleMaps);
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;

        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
          disableDefaultUI: true,
          scaleControl: true,
          zoomControl: true,
        });

        this.googleMaps.event.addListenerOnce(map, "idle", () => {
          this.renderer.addClass(mapEl, "visible");
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
}
