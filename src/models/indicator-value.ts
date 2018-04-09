export interface IndicatorIdentification{
    codeDomaine: string;
    codeIndicateur: string;
    codeRegate: number;    
}

export class IndicatorValue implements IndicatorIdentification{
    // Properties
    public trigramme: string;
    public codeDomaine: string;
    public libelleDomaine: string;
    public codeIndicateur: string;
    public libelleIndicateur: string;
    public codeRegate: number;
    public idTemp: number;
    public value: number;
}