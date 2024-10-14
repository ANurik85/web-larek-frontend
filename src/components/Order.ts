import { Form } from "./common/Form";
import { FormErrors, IFormContacts } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<IFormContacts> {
  

  order: IFormContacts = {
    email: '',
    phone: '',
  };
  formErrors: FormErrors = {};
  

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  setOrderField(field: keyof IFormContacts, value: string) {
    (this.order[field]) = value;

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

}