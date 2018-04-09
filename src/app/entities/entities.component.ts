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
  
  //===============================================================================
  // Properties
  //===============================================================================
  public dexEntities: Entity[];
  public selectedDexEntity: Entity;

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
    {luis: 'Vert', value: environment.goodColor},
    {luis: 'Orange', value: environment.warnColor},
    {luis: 'Rouge', value: environment.badColor},
    {luis: 'Gris', value: environment.noneColor},
  ];

  public luisTrendingToTrending = [
    {luis: 'Hausse', value: environment.trendingUp},
    {luis: 'Stable', value: environment.trendingFlat},
    {luis: 'Baisse', value: environment.trendingDown},
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
  @HostListener('window:forwardEvent-event', ['$event']) 
  handleEvents(event: CustomEvent) {
    if(!event.detail.data || !event.detail.data.name){
      return;
    }

    if (event.detail.data.name === 'searchResult'){
      this.updateFilters(event.detail.data.value);
      return;
    }

    if (event.detail.data.name === 'reset'){
      this.reset();
      return;
    }

    if (event.detail.data.name === 'help'){
      this.updateFilters(event.detail.data.value);
      return;
    }
  }

  private reset(){
    this.selectedDexEntity = null;
    this.selectedIndicatorLevel = '';
    this.selectedIndicatorTrending = '';
    this.updateSelectedEntities();
  }

  private updateFilters(value: any)
  {
    // We try to find the corresponding indicator color
    const wantedSector = value.Secteur ? value.Secteur.toUpperCase() : null;
    const wantedColor = this.translateFromLuis(value.Couleur, this.luisColorToColor);
    const wantedTrending = this.translateFromLuis(value.Tendance, this.luisTrendingToTrending);

    // We filter the sector
    if (wantedSector){
      for (let sector of this.dexEntities){
        if (sector.LibelleBureau.indexOf(wantedSector) !== -1){
          this.selectedDexEntity = sector;
        }
      }
    }

    if (wantedColor){
      for(let entry of this.indicatorLevels){
        if (entry.value === wantedColor){
          this.selectedIndicatorLevel = wantedColor;
          break;
        }
      }
    }
 
    if (wantedTrending){
      for (let trending of this.indicatorTrendings){
        if (trending.value === wantedTrending){
          this.selectedIndicatorTrending = trending.value;
        }
      }
    }
    
    this.updateSelectedEntities();
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
    this.dexEntities = new Array<Entity>();
    for(let entity of entities) {
      if (this.entityIsDex(entity)){
        this.dexEntities.push(entity)
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
    this.updateSelectedEntities();
  }

  //===============================================================================
  // Indicators values
  //===============================================================================
  private getIndicators(){
    this.entityService.getIndicators().subscribe(
      indicators => {
         this.indicators = indicators 
         this.updateSelectedEntities();
      }
    );
  }
  
  private updateSelectedEntities(){
    this.selectedIndicators = new Array<Indicator>();
    var numberOfIndicators = 100;

    for (let indicator of this.indicators){
      if (this.selectedDexEntity && (indicator.codeRegate !== this.selectedDexEntity.CodeRegate)){
        continue;
      }

      if (!this.filtersOK(indicator)){
        continue;
      }

      numberOfIndicators--;
      if (numberOfIndicators === 0){
        return;
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
    this.updateSelectedEntities();
  }
}
