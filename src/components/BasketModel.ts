import { ICard, IProduct } from "../types";

export interface IBasketModel {
  items: Map<string, number>;
  getItems(): { id: string, quantity: number }[]
}

interface EventEmitter {
  emit: (event: string, data: unknown) => void;
}

export class BasketModel implements IBasketModel {
  items: Map<string, number> = new Map();
  basket: IProduct[] = [];

  constructor(protected events: EventEmitter) { }

  addToBasket(cardId: IProduct): boolean {

    const index = this.basket.findIndex(item => item.id === cardId.id);
    if (index === -1) {
      this.basket.push(cardId);
      this.items.set(cardId.id, 1);
      this.updateItemCount();
      return true;
    } else {
      const currentQuantity = this.items.get(cardId.id) || 0;
      this.items.set(cardId.id, currentQuantity + 1);
      this.updateItemCount();
      return false;
    }
  }
  
  removeCard(cardId: string) {
    this.basket = this.basket.filter(card => card.id !== cardId);
    this.items.delete(cardId);
    this.events.emit('basket:remove', { id: cardId });
    this.updateItemCount();
  }

  clearBasket(): void {
    this.basket.forEach(card => {
      this.removeCard(card.id);
    });
    this.basket = [];
    this.updateItemCount();
  }

  getItems(): { id: string, quantity: number }[] {
    return Array.from(this.items.entries()).map(([id, quantity]) => ({ id, quantity }));
  }

  getItemCount(): number {
    return this.items.size;
  }

  // Обновляем отображение количества карточек в корзине
  updateItemCount() {
    const itemCount = this.getItemCount();
    this.events.emit('basket:update', { itemCount });
  }
}