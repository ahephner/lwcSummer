import { LightningElement, api, wire, track } from 'lwc';
import salesAssetFiles from '@salesforce/apex/assetAdminController.salesAssetFiles';
import Id from '@salesforce/user/Id';

const cols = [
    {label:'Title', fieldName:'Title', type:'text'},
    {label:'Link', fieldName:'linkURL', type:'url',
    typeAttributes:{
        label:{
            fieldName:'FileType'
        },
        target:'_blank'
    }}
]
export default class AssetFiles extends LightningElement{
    userId = Id;
    @api prop2; 
    columnsList = cols; 
    @track files;
    @wire(salesAssetFiles,{user: '$userId'})
        wiredMethod({error, data}){
            if(data){
                console.log('data found');
                
                this.files = data;
                this.error = undefined;
                this.files = this.files.map(x=>{
                    return{...x,
                          linkURL: window.location.host+'/lightning/r/ContentDocument/'+x.Id+'/view' 
                    }
                })
                
            }else if(error){
                this.error = error;
                console.log('error -> '+this.error);
                
            }
        }
}

