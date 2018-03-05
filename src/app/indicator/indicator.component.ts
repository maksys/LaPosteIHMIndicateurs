import { Component, Input, OnInit } from '@angular/core';
import { Indicator } from '../../models/indicator';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.css']
})
export class IndicatorComponent implements OnInit {
  //===============================================================================
  // Fields
  //===============================================================================
  private _indicator: Indicator;
  private _target: number;

  //===============================================================================
  // Properties
  //===============================================================================
  public title: string;
  public percent: number;
  public circlePercent: number;
  public backgroundColor: string;
  public trending: string;
  public hasTrending: boolean;

  //===============================================================================
  // Input
  //===============================================================================
  @Input()
  set indicator(indicator: Indicator) {
    this._indicator = indicator;
    this.title = this._indicator.libelleIndicateur;
    this.percent = this._indicator.percent;
    this.circlePercent = this.percent%100;
    
    // Do we have to show a completion circle
    if (this.percent > 100){
      this.backgroundColor = 'white';
    }

    this.trending = this._indicator.trending;
    this.hasTrending = !(this.trending === environment.trendingNone);
  }

  get indicator(): Indicator { return this._indicator; }

  //===============================================================================
  // Constructor
  //===============================================================================
  constructor() { }

  ngOnInit() {
  }

  //===============================================================================
  // Methods
  //===============================================================================
  public getColor(): string{
    return this._indicator.color;
  }
}
