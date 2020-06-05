import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import searchAccount from '@salesforce/apex/getGoalsController.searchAccount'; 
export default class SalesGoalNewGoalModal extends LightningElement {
        //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
        @track isModalOpen = false;
         searchKey = ''; 
        @track accounts; 
        //need pageRef for pub/sub
        @wire(CurrentPageReference)pageRef; 

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

        //search for account
        search(event){
            window.clearTimeout(this.delayedTimeout);
            const key = event.target.value; 
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() =>{
                this.searchKey = key;
                
            }, 400);
            console.log('var '+ this.searchKey + ' key ' + key);
            
        }

        //send search to apex
        @wire(searchAccount, {searchKey: '$searchKey'})
            loadAccount(results){
                this.accounts = results; 
                console.log('accounts '+this.accounts);
                
            }

        save() {
            // to close modal set isModalOpen tarck value as false
            //Add your code to call apex method or do some processing
            this.isModalOpen = false;
        }
}