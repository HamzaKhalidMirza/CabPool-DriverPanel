import { ModalController } from '@ionic/angular';
import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-picker-modal',
  templateUrl: './location-picker-modal.component.html',
  styleUrls: ['./location-picker-modal.component.scss'],
})
export class LocationPickerModalComponent implements OnInit {

  @ViewChild('editFromIcon') editFromIcon: ElementRef;
  @ViewChild('closeFromIcon') closeFromIcon: ElementRef;
  @ViewChild('editWhereIcon') editWhereIcon: ElementRef;
  @ViewChild('closeWhereIcon') closeWhereIcon: ElementRef;

  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  onInputFrom(value) {
    if(value === '') {
      this.closeFromIcon.nativeElement.style.display = 'none';
      this.editFromIcon.nativeElement.style.display = 'block';
    } else {
      this.closeFromIcon.nativeElement.style.display = 'block';
      this.editFromIcon.nativeElement.style.display = 'none';
    }
  }

  onInputWhere(value) {
    if(value === '') {
      this.closeWhereIcon.nativeElement.style.display = 'none';
      this.editWhereIcon.nativeElement.style.display = 'block';
    } else {
      this.closeWhereIcon.nativeElement.style.display = 'block';
      this.editWhereIcon.nativeElement.style.display = 'none';
    }
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

}
