import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IndicatorValue } from '../models/indicator-value';
import { Indicator } from '../models/indicator';

import { INDICATOR_VALUES_DATA } from '../assets/IndicatorValuesData';
import { ENTITIES_DATA } from '../assets/EntitiesData';
import { CODE_TO_DOMAIN_DATA, CODE_TO_INDICATOR_DATA } from '../assets/CodeToLabelData';

export class InMemoryEntityService implements InMemoryDbService {
  createDb() {
    const entities = ENTITIES_DATA;
    const indicatorValues = this.buildIndicatorValues(INDICATOR_VALUES_DATA);

    return {
      entities,
      indicatorValues,
    };
  }

  //===============================================================================
  // Building methods
  //===============================================================================  
  private buildCodeToLabelMap(mapData: string[]): Map<string,string>{
    const map = new Map<string,string>();
    for (let data of mapData){
      const values = data.split(';');
      map.set(values[0], values[1]);
    }

    return map;
  }

  private buildIndicatorValues(indicatorValuesData: string[]): IndicatorValue[]{
    // We create maps to get labels from code
    const codeToDomainMap = this.buildCodeToLabelMap(CODE_TO_DOMAIN_DATA)
    const codeToIndicatorMap = this.buildCodeToLabelMap(CODE_TO_INDICATOR_DATA);

    const indicatorValues = new Array<IndicatorValue>();
    for(let line of INDICATOR_VALUES_DATA){
      if (line.startsWith("COD_DOMAINE")){
        continue;
      }

      let values = line.split(';');
      let newValue = new IndicatorValue();
      newValue.codeDomaine = values[0];
      newValue.libelleDomaine = codeToDomainMap.get(newValue.codeDomaine);
      newValue.codeIndicateur = values[1];
      newValue.libelleIndicateur = codeToIndicatorMap.get(newValue.codeIndicateur);
      newValue.codeRegate = +values[2];
      newValue.idTemp = +values[3];
      newValue.value = +values[4];
      indicatorValues.push(newValue);            
    }

    return indicatorValues
  }
}
