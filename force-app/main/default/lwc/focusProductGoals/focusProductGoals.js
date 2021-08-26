import { LightningElement, track } from 'lwc';
import getGoals from '@salesforce/apex/focusProductGoals.getGoals';
import getSales from '@salesforce/apex/focusProductGoals.getSales'; 

export default class FocusProductGoals extends LightningElement {
    @track goals; 
    sales;
    @track ng;  
    error; 
    connectedCallback(){
       this.handleLoad(); 
       this.handleLoadTwo();
    }

    handleLoad(){
        getGoals()
          .then(result =>{
              this.goals = result;
          
            console.log('goals '+JSON.stringify(this.goals));

          }).catch(error => {
              this.error = error; 
              console.log('error -> '+ error);
              
          })
    }
    handleLoadTwo(){
        getSales()
        .then(x =>{
            let rep;
            let cost;
            let price;
            let golfCat;
            let lawnCat; 
            this.sales = x.map(item=>{
                rep = item.Sales_Document__r.Sales_Rep__c; 
                cost = item.Extended_Cost__c;
                price = item.Extended_Price__c;
                golfCat = item.Golf_Focus_Product_Category__c;
                lawnCat = item.LTO_Focus_Product_Category__c
                return {rep, cost, price, golfCat, lawnCat};
            });
            console.log('sales '+JSON.stringify(this.sales));
            
            
    }).catch(error => {
        this.error = error; 
        console.log('error -> '+ error);
        
    })
}

}