import { EventEmitter } from "./base/events";
import { IFormAddress, IFormContacts } from "../types";

export class OrderModel {
  private _contacts: Partial<IFormContacts> = {};
  private _address: Partial<IFormAddress> = {};

  constructor(private events: EventEmitter) { 

  }

  updateContacts(data: Partial<IFormContacts>) {
    this._contacts = { ...this._contacts, ...data };
    
  }

  updateAddress(data: Partial<IFormAddress>) {
    this._address = { ...this._address, ...data };
    
  }

  checkIfReady() {
    if (this._contacts.email && this._contacts.phone && this._address.address) {
      const finalOrderData = {
        ...this._contacts,
        ...this._address,
      };
      this.events.emit('contacts:submit', finalOrderData);
    }
  
  }
}

