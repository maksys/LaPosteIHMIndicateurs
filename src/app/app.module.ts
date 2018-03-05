import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// GUI modules
import { NgCircleProgressModule } from 'ng-circle-progress';
import {
  MatFormFieldModule,
  MatOptionModule, 
  MatSelectModule } from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { EntitiesComponent } from './entities/entities.component';
import { EntityService } from '../services/entity.service';
import { MessageService } from '../services/message.service';
import { InMemoryEntityService } from '../services/in-memory-entity.service';
import { MessageComponent } from './message/message.component';
import { IndicatorComponent } from './indicator/indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    EntitiesComponent,
    MessageComponent,
    IndicatorComponent,
  ],
  imports: [
    NoopAnimationsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,

    BrowserModule,
    FormsModule,
    HttpClientModule,
    
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryEntityService, 
      { dataEncapsulation: false }),
    
    NgCircleProgressModule.forRoot({
      radius: 30,
      showSubtitle: false,
      backgroundStroke: "transparent",
      backgroundStrokeWidth: 3,
      backgroundPadding: 4,
      outerStrokeWidth: 4,
      outerStrokeLinecap: "square",
      outerStrokeColor: "#78C000",
      showInnerStroke: true,
      innerStrokeWidth: 4,
      innerStrokeColor: "#000000",
      space: -4,
      titleFontSize: "18",
      unitsFontSize: "16",
      titleColor: "#483500",
      unitsColor: "#483500",
      animationDuration: 100
    })
  ],
  providers: [
    EntityService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
