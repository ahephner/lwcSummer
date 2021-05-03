import { LightningElement,api, track } from 'lwc';

export default class RecentPurchaseFlow extends LightningElement {
    @api prodName
    found= false;
    @track data; 
    
    @api
    get docs(){
        return this.data; 
    }
    set docs(value){
        this.data = [...value]
    }
connectedCallback(){
    console.log('data length '+ this.data.length);
    this.sort(this.data)
}
    sort(list){
        //sort the data and only keep top 5 transactions
        let sorted = list.sort((a, b)=>b.Doc_Date__c - a.Doc_Date__c);
        sorted = sorted.splice(0,5)    
    
//here will manipulate the data to display to the user
        this.data = sorted.map(i=>{
                        return i.Doc_Date__c})
        console.log('docs ' +this.docs);
         
    }
}