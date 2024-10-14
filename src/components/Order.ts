import {Form} from "./common/Form";
import {IFormContacts} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IFormContacts> {
  
  // private _items: string[] = [];
  
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
  }
    
    set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

}