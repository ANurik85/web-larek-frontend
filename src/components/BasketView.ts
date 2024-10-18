import { IProduct } from "../types";
import { ensureElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "././base/events";
import { CardsData } from "./CardsData";

// класс отображение, и реализация отдельного товара в корзину
interface IViewConstructor {
  new(container: HTMLElement, events?: EventEmitter): IView; // на входе контейнер, в него будем выводить
}
interface IView {
  render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}

export class BasketItemView implements IView {
  
  // элементы внутри контейнера
  title: HTMLSpanElement;
  price: HTMLSpanElement;
  protected removeButton: HTMLButtonElement;
  protected indexNumber: HTMLSpanElement; // Порядковый номер

  // данные, которое хотим сохранить на будущее
  protected id: string | null = null;
  
  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    this.indexNumber = container.querySelector('.basket__item-index') as HTMLSpanElement;
    this.title = container.querySelector('.card__title') as HTMLSpanElement;
    this.price = container.querySelector('.card__price') as HTMLSpanElement;
    
    this.removeButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    // устанавливаем события

    
    this.removeButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }

  render(data: { id: string, title: string, price: string }) {
    if (data) {
      // если есть новое данные, то запомним их
      this.id = data.id;
      // и выведем в интерфейс
      // this.indexNumber = data.indexNumber,
      this.title.textContent = data.title,
      this.price.textContent = data.price
    }

    return this.container;
  }
  // Метод для получения значения id
  getId(): string | null {
    return this.id;
  }
  // Метод для получения элемента
  getElement(): HTMLElement {
    return this.container;
  }

  // Метод для установки порядкового номера
  setIndexNumber(number: number) {
    this.indexNumber.textContent = `${number}`; 
  }
}

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

  }
  setTotal(total: number) {
    this._total.textContent = formatNumber(total);
  }

  // Метод для нахождения и суммирования цен всех карточек в корзине
  calculateTotal(): number {
    return this.items.reduce((sum, item) => {
      const priceText = item.price.textContent;
      const price = priceText ? parseFloat(priceText.replace(/[^\d.-]/g, '')) : 0;
      return sum + price;
    }, 0);
  }

  updateTotal() {
    const total = this.calculateTotal();
    this.setTotal(total);
  }

  render(data: { items: HTMLElement[] }) {
    if (data) {
      this.container.replaceChildren(...data.items);
      this.updateTotal(); // Обновление общей стоимости при рендере
    }
    return this.container;
  }

}


