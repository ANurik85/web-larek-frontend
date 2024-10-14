import { Form } from "./common/Form";
import { FormErrors, IFormAddress } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class OrderAddress extends Form<IFormAddress> {

  private _paymentMethod: string;
  protected _button: HTMLElement;
  order: IFormAddress = {
    paymentMethod: '',
    address: ''
  };
  formErrors: FormErrors = {};

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._button = this.container.querySelector('.order__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
  }


  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set paymentMethod(value: string) {
    const buttons = this.container.querySelectorAll('.order__buttons button');
    buttons.forEach((button) => {
      if (button.getAttribute('value') === value) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }

  get paymentMethod(): string {
    return this._paymentMethod;
  }

  setOrderField(field: keyof IFormAddress, value: string) {
    (this.order[field]) = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
}
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}