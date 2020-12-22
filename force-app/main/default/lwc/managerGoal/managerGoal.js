import { LightningElement,wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import { CurrentPageReference } from 'lightning/navigation';
import getGoal from '@salesforce/apex/managerGoal.getGoal';
import { refreshApex } from '@salesforce/apex';
import getForecastTotal from '@salesforce/apex/getGoalsController.getForecastTotal';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class ManagerGoal extends LightningElement {
    userId = Id;
    @track error;
    @track goal = 0; 
    @track repForecast; 
    @track loading;
    @track loaded = true; 
    wiredTotal;
    @wire(CurrentPageReference)pageRef; 
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
             repList(result){
                 console.log('result '+ result.data);
                 
                 this.wiredTotal = result;
                 if(result.data){
                     this.repForecast = result.data
                     this.error = undefined
                 }else if(result === undefined){
                     this.repForecast = 0;
                     this.error = error;
                     console.log(this.error);
                     
                 }
             }
//this listens for the request to refresh
        connectedCallback(){
            console.log('listening');
            
            registerListener('update', this.refreshTotal, this);
        }
        disconnectedCallback(){
            unregisterAllListeners(this)
        }

        refreshTotal(x){
            this.loaded = false;
            this.loading = true;
            refreshApex(this.wiredTotal)
            this.loading = false; 
            this.loaded = true; 
        }
}