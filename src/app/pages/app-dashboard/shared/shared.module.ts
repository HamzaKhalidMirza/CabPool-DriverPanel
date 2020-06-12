import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { MapCoverComponent } from './pickers/map-cover/map-cover.component';
import { LocationPickerModalComponent } from './modals/location-picker-modal/location-picker-modal.component';

@NgModule({
    declarations: [
        ImagePickerComponent,
        MapCoverComponent,
        LocationPickerModalComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
    exports: [
        ImagePickerComponent,
        MapCoverComponent,
        LocationPickerModalComponent
    ],
    entryComponents: [
        LocationPickerModalComponent
    ]
  })
  export class SharedModule {}
  