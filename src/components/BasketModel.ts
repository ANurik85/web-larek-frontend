import { IProduct } from "../types";


export interface IBasketModel {
  // items: Map<string, number>;
  basket: IProduct[];
  getItems(): { id: string, quantity: number }[]
}

interface EventEmitter {
  emit: (event: string, data: unknown) => void;
}

export class BasketModel implements IBasketModel {
  // items: Map<string, number> = new Map();
  basket: IProduct[] = [];

  constructor(protected events: EventEmitter) { }

  addToBasket(cardId: IProduct): boolean {
    const index = this.basket.findIndex(item => item.id === cardId.id);
    if (index === -1) {
      this.basket.push({ id: cardId.id.toString(), title: cardId.title, price: cardId.price, indexNumber: cardId.indexNumber });
      this.updateItemCount();
      return true;
    } else {
      const currentQuantity = this.basket.find(item => item.id === cardId.id)?.indexNumber || 0;
      this.basket = this.basket.map(item => item.id === cardId.id ? { ...item, quantity: item.indexNumber + 1 } : item);
      this.updateItemCount();
      return false;
    }
  }
  
  removeCard(cardId: string) {
    this.basket = this.basket.filter(card => card.id !== cardId);
    // this.basket.delete(cardId);
    this.updateItemCount();
    
  this.updateTotal();
  this.events.emit('basket:update', { total: this.calculateTotal() }); // добавьте этот вызов
  };
  
  clearBasket(): void { 
    this.basket.forEach(card => {
      this.removeCard(card.id);
    });
    this.basket = [];
    this.updateItemCount();
    this.updateTotal();
    this.events.emit('basket:updated', { total: this.calculateTotal() });
  }

  getItems(): { id: string, quantity: number }[] {
    return this.basket.map((item, index) => ({ id: item.id, quantity: 1 }));
  }

  getItemCount(): number {
    return this.basket.length;
  }

  // Обновляем отображение количества карточек в корзине
  updateItemCount() {
    const itemCount = this.getItemCount();
    this.updateTotal();
    this.events.emit('basket:update', { itemCount });
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