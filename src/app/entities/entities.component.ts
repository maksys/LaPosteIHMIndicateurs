import { Component, OnInit, HostListener } from '@angular/core';

import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entity.service';
import { Indicator } from '../../models/indicator';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})
export class EntitiesComponent implements OnInit {
  //===============================================================================
  // Fields
  //===============================================================================
  private _lastEntity: Entity;

  //===============================================================================
  // Properties
  //===============================================================================
  public entities: Entity[];
  public selectedEntity: Entity;

  public entityPath: Entity[];

  public indicators: Indicator[];
  public selectedIndicators: Indicator[];

  public indicatorLevels = [
    {value: '', viewValue: 'Tous'},
    {value: environment.goodColor, viewValue: 'Bon'},
    {value: environment.warnColor, viewValue: 'Moyen'},
    {value: environment.badColor, viewValue: 'Alerte'},
  ];
  public selectedIndicatorLevel= '';

  public indicatorTrendings = [
    {value: '', viewValue: 'Tous'},
    {value: environment.trendingUp, viewValue: 'Hausse'},
    {value: environment.trendingFlat, viewValue: 'Plat'},
    {value: environment.trendingDown, viewValue: 'Baisse'},
    {value: environment.trendingNone, viewValue: 'Aucune'}
  ];
  public selectedIndicatorTrending= '';

  public luisColorToColor = [
    {luis: 'vert', value: environment.goodColor},
    {luis: 'orange', value: environment.warnColor},
    {luis: 'rouge', value: environment.badColor},
    {luis: 'gris', value: environment.noneColor},
  ];

  public luisTrendingToTrending = [
    {luis: 'hausse', value: environment.trendingUp},
    {luis: 'stable', value: environment.trendingFlat},
    {luis: 'baisse', value: environment.trendingDown},
  ];

  //===============================================================================
  // Constructor
  //===============================================================================
  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.getEntities();
    this.getIndicators();
  }

  //===============================================================================
  // Listeners
  //===============================================================================
  @HostListener('window:chatframe-event', ['$event']) 
  updateFilters(event: CustomEvent) {
    // We try to find the corresponding indicator color
    const wantedSector = event.detail.Secteur.toUpperCase();
    const wantedColor = this.translateFromLuis(event.detail.Couleur, this.luisColorToColor);
    const wantedTrending = this.translateFromLuis(event.detail.Tendance, this.luisTrendingToTrending);

    // We filter the sector
    if (wantedSector){
      for (let sector of this.entities){
        if (sector.LibelleBureau.indexOf(wantedSector) !== -1){
          this.selectedEntity = sector;
          this._lastEntity = this.selectedEntity;
        }
      }
    }

    if (wantedColor){
      if (wantedColor === environment.noneColor){
        this.selectedIndicatorLevel = '';
        this.selectedIndicatorTrending = environment.trendingNone
      } else {
        this.selectedIndicatorTrending = '';
        for(let entry of this.indicatorLevels){
          if (entry.value === wantedColor){
            this.selectedIndicatorLevel = wantedColor;
            break;
          }
        }
      }
    } else {
      this.selectedIndicatorLevel = '';
    }

    if (wantedTrending){
      for (let trending of this.indicatorTrendings){
        if (trending.value === wantedTrending){
          this.selectedIndicatorTrending = trending.value;
        }
      }
    } else if (wantedColor !== environment.noneColor) {
      this.selectedIndicatorTrending = '';
    }
    
    if (this._lastEntity){
      this.getIndicatorsForEntity(this._lastEntity);
    }
  }
  
  private translateFromLuis(luisValue: string, translations: Array<any>): string{
    for(let translation of translations){
      if (luisValue === translation.luis){
        return translation.value;
      }
    }
    return '';
  }

  //===============================================================================
  // Entities methods
  //===============================================================================
  private getEntities(){
    this.entityService.getEntities().subscribe(
      entities => this.filterDexes(entities)
    );
  }

  private filterDexes(entities: Entity[]) {
    this.entities = new Array<Entity>();
    for(let entity of entities) {
      if (this.entityIsDex(entity)){
        this.entities.push(entity)
      }
    }
  }

  private entityIsDex(entity: Entity): boolean{
    return entity.CodeBureau === entity.CodeDex &&
           entity.CodeDr === "-1" &&
           entity.CodeDt === "-1";
  }

  private entityIsDr(entity: Entity): boolean{
    return entity.CodeBureau === entity.CodeDr &&
           entity.CodeDt === "-1";
  }

  private entityIsDt(entity: Entity): boolean{
    return entity.CodeBureau === entity.CodeDt;
  }  

  public onEntityChange(eventValue){
    this._lastEntity = this.selectedEntity;
    this.getIndicatorsForEntity(this._lastEntity);
  }

  //===============================================================================
  // Indicators values
  //===============================================================================
  private getIndicators(){
    this.entityService.getIndicators().subscribe(
      indicators => { this.indicators = indicators }
    );
  }
  
  private getIndicatorsForEntity(entity: Entity){
    this._lastEntity = entity;
    this.selectedIndicators = new Array<Indicator>();

    for (let indicator of this.indicators){
      if (indicator.codeRegate !== entity.CodeRegate){
        continue;
      }

      if (!this.filtersOK(indicator)){
        continue;
      }

      this.selectedIndicators.push(indicator);
    }
  }

  public filtersOK(indicator: Indicator): boolean{
    if (this.selectedIndicatorLevel === '' && this.selectedIndicatorTrending === ''){
      return true;
    }

    return (this.selectedIndicatorLevel === '' || indicator.color === this.selectedIndicatorLevel) &&
           (this.selectedIndicatorTrending === '' || indicator.trending === this.selectedIndicatorTrending)
  }

  public onFilterChange(eventValue){
    if (this.indicators.length === 0){
      return;
    }
    this.getIndicatorsForEntity(this._lastEntity);
  }
}
