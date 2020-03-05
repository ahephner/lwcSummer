import { LightningElement,wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getGoal from '@salesforce/apex/managerGoal.getGoal';

export default class ManagerGoal extends LightningElement {
    userId = Id;
    @track error;
    @track goal; 
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
}