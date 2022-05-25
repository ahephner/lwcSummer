import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
    publish
} from 'lightning/messageService';
import Head_Phones from '@salesforce/messageChannel/Head_Phones__c';
export default class Receiver extends LightningElement {
    subscritption = null;
    count = 0; 
    goodNumber;
    firstNumb; 
    // To pass scope, you must get a message context.
@wire(MessageContext)
messageContext;

connectedCallback(){
    this.subscribeToMessageChannel();
}

disconnectedCallback(){
    this.unsubscribeToMessageChannel();
}
// Pass scope to the subscribe() method.
subscribeToMessageChannel() {
    if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            Head_Phones,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }
}
highEnough(numb){
    if(numb >= 5){
        this.goodNumber = true;
        this.count = numb; 
    }else{
        this.firstNumb = numb; 
        this.goodNumber = false; 
    }
}
handleMessage(mess){
    const st = mess.update;
    console.log(st);
     
    switch(st){
        case 'pass':
            this.highEnough(mess.number); 
            break;
        case 'self':
            console.log('numb', mess.number)
            this.highEnough(mess.number)
            
            break; 
        default:
            console.log('nothing');
            
    }
    
}

handleUpdate(){
    const payload = {update: 'number'}

    publish(this.messageContext, Head_Phones, payload); 
}
unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
}
}