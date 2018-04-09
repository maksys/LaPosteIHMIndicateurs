import { IndicatorValue, IndicatorIdentification } from "./indicator-value";
import { environment } from "../environments/environment";

export class Indicator implements IndicatorIdentification{
    // Fields
    public values = new Map<number, number>();

    // Properties
    public codeRegate: number;
    public codeDomaine: string;
    public codeIndicateur: string;

    public libelleDomaine: string;
    public libelleIndicateur: string;

    public idTemp: number;
    public value: number;

    // Calculated properties
    public trigramme = '';
    public percent = 0;
    public color = environment.noneColor;
    public trending = environment.trendingNone;

    constructor(indicatorValue: IndicatorValue){
        this.trigramme = indicatorValue.trigramme;

        this.codeRegate = indicatorValue.codeRegate;
        this.codeDomaine = indicatorValue.codeDomaine;
        this.codeIndicateur = indicatorValue.codeIndicateur;

        this.libelleDomaine = indicatorValue.libelleDomaine;
        this.libelleIndicateur = indicatorValue.libelleIndicateur;

        this.values.set(indicatorValue.idTemp, indicatorValue.value);
    }

    public addIndicatorValue(indicatorValue: IndicatorValue){
        if(this.codeRegate !== indicatorValue.codeRegate ||
           this.codeDomaine !== indicatorValue.codeDomaine ||
           this.codeIndicateur !== indicatorValue.codeIndicateur ||
           this.values.has(indicatorValue.idTemp)){
            return;
        }

        this.values.set(indicatorValue.idTemp, indicatorValue.value);
    }

    public CalculateValues(){
        this.percent = this.getPercent();
        this.trending = this.getTrending();
        this.color = this.getColor();
    }

    private getPercent(): number{
        let number = 0;
        const keys = Array.from(this.values.keys())
        for(let key of keys){
          number = number + this.values.get(key);
        }
    
        if (number > 0){
          number += 50;
        }
        return number;
      }

    private getTrending(): string{
        const values = Array.from(this.values.values())
        
        let firstValue = NaN;
        let secondValue = NaN;
        let lastValidIndex = NaN;
        
        // We get a first valid value
        for (let i = 0; i < values.length; i++) {
            if (values[i] !== NaN) {
                firstValue = values[i];
                lastValidIndex = i + 1;
                break;
            }            
        }      

        // If we didn't found a first valid value, we can stop now
        if(firstValue === NaN || lastValidIndex >= values.length){
            return environment.trendingNone;
        }

        // We get a second valid value
        for (let i = lastValidIndex; i < values.length; i++) {
            if (values[i] !== NaN) {
                secondValue = values[i];
                break;
            }                        
        }

        // If we didn't found a second valid value, we can stop now
        if(secondValue === NaN){
            return environment.trendingNone;
        }

        if (firstValue === secondValue){
            return environment.trendingFlat;
        }
        if(firstValue > secondValue){
            return environment.trendingDown;
        } else if (firstValue < secondValue){
            return environment.trendingUp;      
        }

        return environment.trendingNone;
    }  
    
    private getColor(): string{
        if(this.percent >= 100){
          return environment.goodColor;
        }
        else if (this.percent >= 75){
          return environment.warnColor;
        }
        else if (this.trending === environment.trendingNone){
          return environment.noneColor;
        } else {
          return environment.badColor;
        }
    }    
}