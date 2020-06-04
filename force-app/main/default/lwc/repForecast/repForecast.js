import { LightningElement, wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getForecastTotal from '@salesforce/apex/getGoalsController.getForecastTotal';
export default class RepForecast extends LightningElement {
    userId = Id; 
    @track error;
    @track repForecast;
    @wire(getForecastTotal,{userId: '$userId'})
        wireMethod({error,data}){
            if(error){
                this.error = error;
                console.log(this.error);
            }else if(data){
                this.repForecast = data;
                this.error = undefined;
                
            }
        }

}