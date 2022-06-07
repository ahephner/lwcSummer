import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    publish,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import Head_Phones from '@salesforce/messageChannel/Head_Phones__c';
export default class MessageSender extends LightningElement {
    subscritption; 
    passNumb = 0; 
    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    //subscribe to channel
    subscribeToMessageChannel(){
        
        if(!this.subscritption){
            this.subscritption = subscribe(
                this.messageContext,
                Head_Phones,
                (message) => this.handleMessage(message),
                {scope:APPLICATION_SCOPE}
            );
        }
    }
    to(){
        setTimeout(() => {
            this.passNumb = Number(this.passNumb) + 5
            this.updatedFromRec(this.passNumb);  
        }, 1000);
    }
    handleMessage(mess){
        if(mess.update){
            const m = mess.update;
            switch(m){
                case 'number':
                    this.to(); 
                    break;
                default:
                    console.log('all done')
            }
        }

        
    }
    handleNumber(x){
        this.passNumb = x.detail.value;
        this.passNumb > 0 ? this.addOne() : console.log('need a positive number') 
    }
    addOne(){
        console.log('addOne', this.passNumb)
        const payLoad = {
            number: this.passNumb,
            update: 'pass'
        }

        publish(this.messageContext,Head_Phones,payLoad);
    }

    updatedFromRec(x){
        const payLoad = {
            number: x,
            update: 'self'
        }
        publish(this.messageContext, Head_Phones, payLoad); 
    }
}