import { LightningElement } from 'lwc';
import {getTermOptions} from 'c/helper'
export default class Buttons extends LightningElement {
    termOptions = getTermOptions();
    term = 30;
    firstLoad = true

      handleNotification = (event) => {
         if(event.key === 'S'){
             this.removeEvent();
         }
      };

      connectedCallback(){
          console.log('listening')
              window.addEventListener('keydown', this.handleNotification,{
                  once:false,
        
          }); 
             window.addEventListener('beforeunload', this.removeEvent)
      }
      removeEvent(){
        window.removeEventListener('keydown', this.handleNotification); 
        return confirm('Are you sure you want to leave the page?');
        //window.removeEventListener('keydown', this.handleNotification);
      }
    //   disconnectedCallback(){
    //       console.log('disconnect')
    //     window.removeEventListener('keydown', this.handleNotification); 
    //   }
    handleKeyDown(event){
        console.log(event.key, event.code);
        
    }
    termChange(event){
        this.term = event.detail.value; 
        console.log(this.term)
    }

}