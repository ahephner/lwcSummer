import { LightningElement,wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getGoal from '@salesforce/apex/managerGoal.getGoal';
import getForecastTotal from '@salesforce/apex/getGoalsController.getForecastTotal';

export default class ManagerGoal extends LightningElement {
    userId = Id;
    @track error;
    @track goal = 0; 
    @track repForecast; 
//get manager goal
    @wire(getGoal, {userId: '$userId'})
        wiredMethod({error,data}){
            if(error){
                this.error = error;
                // eslint-disable-next-line no-console
                console.log(this.error);
                

                this.goal = undefined;
            }else if(data){
                this.goal = data.Active_Monthly_Budget__c;
                this.error= undefined;
            }
        }

//get rep forecast amount
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