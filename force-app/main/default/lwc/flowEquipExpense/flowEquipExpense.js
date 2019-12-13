import { LightningElement } from 'lwc';
import { FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class FlowEquipExpense extends LightningElement {
    ///!!!!NO ARROW FUNCTIONS IN FLOW SCREENS!!!

    //next page
    handleNext(){
        const nextNav = new FlowNavigationNextEvent();
        this.dispatchEvent(nextNav);
    }

}