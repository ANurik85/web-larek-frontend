import { Form } from "./common/Form";
import { IFormAddress } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class OrderAddress extends Form<IFormAddress> {
  private _paymentMethod: string;
  protected _button: HTMLElement;
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
}