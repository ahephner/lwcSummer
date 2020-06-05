import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import searchAccount from '@salesforce/apex/getGoalsController.searchAccount'; 
export default class SalesGoalNewGoalModal extends LightningElement {
        //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
        @track isModalOpen = false;
         searchKey = ''; 
        @track prod; 
        @track none; 
        @track show; 
        @track forecast;
        @track comment; 
        @track accountId; 
        //need pageRef for pub/sub
        @wire(CurrentPageReference)pageRef; 
        @track error; 

        connectedCallback(){
            registerListener('open', this.open, this)
        }
        disconnectedCallback(){
            unregisterAllListeners(this)
        }
        //open modal
        open(){
            this.isModalOpen = true; 
        }
        closeModal() {
            // to close modal set isModalOpen tarck value as false
            this.isModalOpen = false;
        }
    //send search to apex
    @wire(searchAccount, {searchKey: '$searchKey'})
    loadProd({error, data}){
        if(data){
            this.prod= data;
            this.error = undefined;
            
            this.showWhat(this.prod.length);
            
        }else if (error){
            this.error = error;
            this.data = undefined;
            console.log(this.error);
            
        }

    }
        showWhat(x){
            if(x> 0){
                this.show = true; 
            }
        }
        //search for account
        search(event){
            window.clearTimeout(this.delayTimeout);
            const searchKey = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchKey = searchKey;
                
            }, 400);
            
            
        }

        newForecast(event){
            this.forecast = event.detail.value; 
        }

        newComment(e){
            this.comment = e.detail.value; 
        }

        handleAccountSelect(event){
            console.log('selected '+ event.target.prods.Name)
            this.accountId = event.target.prods.Id; 
            this.searchKey = event.target.prods.Name; 
            this.show = false;
        }

        save() {
            // to close modal set isModalOpen tarck value as false
            //Add your code to call apex method or do some processing
            this.isModalOpen = false;
        }
}