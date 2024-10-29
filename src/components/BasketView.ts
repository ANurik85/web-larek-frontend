import { ensureElement } from "../utils/utils";
import { EventEmitter } from "././base/events";
import { Component } from "./base/Component";


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

        events.emit('address:open');
      });
    }
    this.checkIfEmpty();
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


  checkIfEmpty() {
    const isEmpty = this._list.children.length === 0;
    if (isEmpty || this._total.textContent === '0 синапсов') {
      this._button.disabled = true;
    } else {
      this._button.disabled = false;
    }
  }


  render(data: { items: HTMLElement[], total: number }) {
   
    if (data) {
      this.setTotal(data.total);
      this._list.replaceChildren(...data.items);
      this.checkIfEmpty();
     
      
    }
    
    return this.container;
  }
}