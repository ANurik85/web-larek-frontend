import { IProduct } from "../types";
import { ensureElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "././base/events";
import { BasketItemView, IView } from "./BasketItemView";
import { CardsData } from "./CardsData";

// корзина товара
export class BasketView implements IView {
  items: BasketItemView[] = [];
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {

    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.events.on('basket:updateTotal', ({ total }: { total: number }) => {
      this.setTotal(total);
    });

  }
  setTotal(total: number) {
    this._total.textContent = formatNumber(total);
  }

  render(data: { items: HTMLElement[] }) {
    if (data) {
      this.container.replaceChildren(...data.items);
    }
    return this.container;
  }

}


