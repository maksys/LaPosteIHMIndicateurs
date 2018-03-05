import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Entity } from '../models/entity';
import { Indicator } from '../models/indicator';
import { IndicatorValue, IndicatorIdentification } from '../models/indicator-value';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class EntityService {
  //===============================================================================
  // Fields
  //===============================================================================
  private _entitiesUrl = 'api/entities';  // URL to web api
  private _indicatorValuesUrl = 'api/indicatorValues'; 

  //===============================================================================
  // Constructor
  //===============================================================================
  constructor(private http: HttpClient,
              private messageService: MessageService) {}

  //===============================================================================
  // Entities
  //===============================================================================    
  /** GET entities from the server */
  getEntities (): Observable<Entity[]> {
    return this.http.get<Entity[]>(this._entitiesUrl)
      .pipe(
        tap(entities => this.log(`fetched entities`)),
        catchError(this.handleError('getEntities', []))
      );
  }

  //===============================================================================
  // Indicators
  //===============================================================================    
  public getIndicators(): Observable<Indicator[]> {
    return this.http.get<IndicatorValue[]>(this._indicatorValuesUrl)
    .pipe(
      tap(indicators => this.log(`fetched indicators`)),
      map(indicators => this.buildIndicators(indicators)),
      catchError(this.handleError('getIndicators', []))
    );
  }

  private buildIndicators(indicatorValues: IndicatorValue[]): Indicator[]{
      const indicators = new Array<Indicator>();
  
      // We find the date ids and order them
      const dateIds = new Array<number>();
      for (let indicator of indicatorValues){
        if (dateIds.find(id => id === indicator.idTemp)){
          continue;
        }
        dateIds.push(indicator.idTemp);
      }
      dateIds.sort((first, second): number => {
        if(first < second) return -1;
        if(first > second) return 1;
        return 0;
      });
      
      // First we build a list of indicators from the first date
      for(let indicVal of indicatorValues){
        if (indicVal.idTemp !== dateIds[0]){
          continue;
        }
        indicators.push(new Indicator(indicVal));
      }
  
      // We now add values for each other date
      dateIds.splice(0,1);
      for(let date of dateIds){
        for(let indicVal of indicatorValues){
          if (indicVal.idTemp !== date){
            continue;
          }
  
          // We're looking for an existing indicator
          let indicator = indicators.find(indic => this.getKey(indic) === this.getKey(indicVal));
          if(indicator){
            indicator.addIndicatorValue(indicVal);
          }
        }
      }

      for (const indicator of indicators) {
        indicator.CalculateValues();
      }

      return indicators;
  }

  private getKey(id: IndicatorIdentification): string{
    return `${id.codeRegate}-${id.codeDomaine}-${id.codeIndicateur}`;
  }

  //===============================================================================
  // Logging
  //===============================================================================
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a EntityService message with the MessageService */
  private log(message: string) {
    this.messageService.add('EntityService: ' + message);
  }
}