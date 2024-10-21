import { ensureElement } from "../utils/utils";
import { EventEmitter } from "././base/events";
import { Component } from "./base/Component";
import { BasketItemView, IView } from "./BasketItemView";
import { BasketModel } from "./BasketModel";

interface IBasketView {
  items: HTMLElement[];
  total: number;

}

// корзина товара
export class BasketView extends Component<IBasketView> {
  
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container);
   
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;
    

    if (this._button) {
      this._button.addEventListener('click', () => {
        console.log('Кнопка basket__button кликнута');
        console.log('events:', events);
        events.emit('address:open');
      });
    }

    this.events.on('basket:updateTotal', ({ total }: { total: number }) => {
      this.setTotal(total);
    });

    
    this.items = [];
  }

  set items(items: HTMLElement[]) {
   
        this._list.replaceChildren(...items);
    }

  setTotal(total: number) {
    this._total.textContent = `${total} синапсов`;
  }


  getElement(): HTMLElement {
    return this.container;
  }
  
 
}


