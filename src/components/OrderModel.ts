import { EventEmitter } from "./base/events";
import { IFormAddress, IFormContacts } from "../types";
import { BasketModel } from "./BasketModel";

export class OrderModel {
  private _contacts: Partial<IFormContacts> = {};
  private _address: Partial<IFormAddress> = {};
  private _items: string[];
  private _total: number;

  constructor(private events: EventEmitter, private basketModel: BasketModel) {
    this.events.on('order:ready', this.updateContacts.bind(this));
    this.events.on('address:ready', this.updateAddress.bind(this));
    this.events.on('basket:updateTotal', this.updateTotal.bind(this));
  }

  updateContacts(data: Partial<IFormContacts>) {
    this._contacts = { ...this._contacts, ...data };
    this.checkIfReady();
  }

  updateAddress(data: Partial<IFormAddress>) {
    this._address = { ...this._address, ...data };
    this.checkIfReady();
  }

  updateItems() {
    this._items = this.basketModel.getItems().map(item => item.id);
    this.checkIfReady();
  }

  updateTotal({ _total }: { _total: number }) {
    this._total = _total;
    this.checkIfReady();
  }

  checkIfReady() {
    if (this._contacts.email && this._contacts.phone && this._address.address && this._total > 0) {
      const finalOrderData = {
        ...this._contacts,
        ...this._address,
        _total: this._total,
        _items: this._items.map(item => item)
      };
      this.events.emit('contacts:submit', finalOrderData);
    }
  }
}
