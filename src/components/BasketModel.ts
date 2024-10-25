import { IProduct } from "../types";

export interface IBasketModel {

  basket: IProduct[];
  getItems(): { id: string, quantity: number }[]
}

interface EventEmitter {
  emit: (event: string, data: unknown) => void;
}

export class BasketModel implements IBasketModel {

  basket: IProduct[] = [];

  constructor(protected events: EventEmitter) { }

  addToBasket(cardId: IProduct): boolean {
    const index = this.basket.findIndex(item => item.id === cardId.id);
    if (index === -1) {
      this.basket.push({ id: cardId.id.toString(), title: cardId.title, price: cardId.price, indexNumber: cardId.indexNumber });
      return true;
    } else {
      this.basket = this.basket.map(item => item.id === cardId.id ? { ...item, quantity: item.indexNumber + 1 } : item);
      return false;
    }
  }

  removeCard(cardId: string) {
    this.basket = this.basket.filter(card => card.id !== cardId);
    this.basket.forEach((product, index) => {
      product.indexNumber = index + 1;
    });
    this.updateItemCount();

    this.updateTotal();
    this.events.emit('basket:update', { total: this.calculateTotal() });
  };
  clearBasket(): void {
    this.basket.forEach(card => {
      this.removeCard(card.id);
    });
    this.basket = [];
    this.updateItemCount();
    this.updateTotal();
    this.events.emit('basket:update', { total: this.calculateTotal() });
  }

  getItems(): { id: string, quantity: number }[] {
    return this.basket.map((item) => ({ id: item.id, quantity: 1 }));
  }

  getItemCount(): number {
    return this.basket.length;
  }

  // Обновляем отображение количества карточек в корзине
  updateItemCount() {
    const itemCount = this.getItemCount();
    this.updateTotal();
    this.events.emit('basket:updateСount', { itemCount });
  }


  calculateTotal(): number {
    return this.basket.reduce((sum, item) => {
      const priceText = item.price;
      if (!isNaN(parseFloat(priceText))) {
        const price = parseFloat(priceText);
        return sum + price;
      } else {
        return sum;
      }
    }, 0);
  }

  updateTotal() {
    const total = this.calculateTotal();
    this.events.emit('basket:updateTotal', { total });
  }



}