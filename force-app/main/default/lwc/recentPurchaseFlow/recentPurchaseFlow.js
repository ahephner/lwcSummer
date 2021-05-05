import { LightningElement,api, track } from 'lwc';

const columns = [
    {label: 'Doc Detail', fieldName:'nameURL', type:'url', 
    typeAttributes:{
        label:{
            fieldName:'Name'
        },
        target:'_blank'
    }},
    {label:'Date', fieldName:'Doc_Date__c', type:'date-local'},
    {label:'QTY', fieldName:'Qty__c', type:'number',cellAttributes: { alignment: 'center' },},
    {label: 'Unit Price', fieldName:'Unit_Price__c', type:'currency', cellAttributes: { alignment: 'center' },},
    {label: 'Margin', fieldName:'margin', type:'text', cellAttributes: { alignment: 'center' },}
]
export default class RecentPurchaseFlow extends LightningElement {
    @api prodName
    found= false;
    @track data; 
    columns = columns;
    //defaultSortDirection = 'asc';

    @api
    get docs(){
        return this.data; 
    }
    set docs(value){
        this.data = [...value]
        //this.data = this.data.splice(0,5); 
    }
connectedCallback(){
    this.sort();
    
}
    sort(){
        console.log('data '+this.data);
        
        if(this.data === undefined){
            this.found = false
        }else if(this.data.lenght <1){
            this.found = false
        }else{
            this.found = true; 
            this.data = this.data.splice(0,5);    
        
//here will manipulate the data to display to the user
        this.data = this.data.map(i=>{
                         return {...i,
                                nameURL: 'https://'+window.location.host+'/'+i.Id,
                                margin: i.Margin__c + ' %'
                        }
        
       })
    }
        
        
         
    }
}