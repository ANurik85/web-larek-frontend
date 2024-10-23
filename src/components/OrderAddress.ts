import { Form } from "./common/Form";
import { FormErrors, IFormAddress, IOrderResult } from "../types";
import { IEvents } from "./base/events";

export class OrderAddress extends Form<IOrderResult> {

  private _payment: string;
  protected _button: HTMLButtonElement;
  protected _buttonSelect: HTMLElement;
  order: IFormAddress = {
    payment: '',
    address: ''
  };
  formErrors: FormErrors = {};

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._payment = '';

    this._button = this.container.querySelector('.order__button') as HTMLButtonElement;
    this._buttonSelect = this.container.querySelector('.order__buttons') as HTMLElement;

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    if (this._buttonSelect) {
      this._buttonSelect.addEventListener('click', (event) => {
        const target = event.target as HTMLButtonElement;
        if (target.classList.contains('button_alt')) {
          this.payment = target.textContent;
          this.setAddressField('payment', target.textContent);
        
        }
      });
    }
    this.payment = 'Cash';
  }


  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }


  set payment(value: string) {
    const buttons = this.container.querySelectorAll('.order__buttons button');
    buttons.forEach((button) => {
      if (button.textContent === value) {
        button.classList.add('button_alt-active');
        button.setAttribute('selected', '');
      } else {
        button.classList.remove('button_alt-active');
        button.removeAttribute('selected');
      }
    });
    this.order.payment = value;
    this._payment = value;
  }

  get payment(): string {
    return this._payment;
  }

  setAddressField(field: keyof IFormAddress, value: string) {
    (this.order[field]) = value;
    if (field === 'payment') {
      this.order.payment = value;
      this._payment = value;
    }
    if (this.validateAddress()) {
      this.events.emit('address:ready', this.order);
    }
  }


  validateAddress() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}