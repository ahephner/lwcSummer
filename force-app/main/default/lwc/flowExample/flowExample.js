import { LightningElement, api, track } from "lwc";
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from "lightning/flowSupport";

export default class FlowExample extends LightningElement {
    @api availableActions = [];
    @track _todos = []
    @api recordId;

    @api
    get todos() {
        return this._todos;
    }


    set todos(todos = []) {
        this._todos = todos;
    }

    get hasTodos() {
        return this._todos && this._todos.length > 0;
    }

    handleUpdatedText(event) {
        this._text = event.detail.value;
    }

    handleAddTodo() {
        this._todos.push(this._text);
        // notify the flow of the new todo list
        const attributeChangeEvent = new FlowAttributeChangeEvent("todos", this._todos);
        this.dispatchEvent(attributeChangeEvent);
    }

    handleGoNext() {
        // check if NEXT is allowed on this screen
        if (this.availableActions.find(action => action === "NEXT")) {
            // navigate to the next screen
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);

        }

    }
}