import _ from "lodash";
import { Model } from "./base/Model";
import { FormErrors, ICardsData, ICard, IOrder, IProduct } from "../types";


export class CardItem extends Model<ICard> {

    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export class CardsData extends Model<ICardsData> {

    catalog: CardItem[] = [];
    basket: IProduct[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        paymentMethod: '',
        address: '',
        items: []
    };

    preview: string | null = null;
    formErrors: FormErrors = {};


    getCardItem(id: string): IProduct | undefined {
        return this.catalog.find((item) => item.id === id);
    }

    toggleOrderedCard(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedCard(id, false);
            this.catalog.find(it => it.id === id)
        });
    }


    getTotal() {
        return this.order.items.reduce((a, c) => a + (this.catalog.find(it => it.id === c)?.price || 0), 0);
    }

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new CardItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: CardItem) {
        this.preview = item.id;
        this.emitChanges('card:select', item);
    }


    setOrderField(field: keyof IOrder, value: string) {
        (this.order[field] as string) = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    addToBasket(cardId: IProduct): { success: boolean, message: string } {
        this.basket.push(cardId);
        return { success: true, message: 'Карточка добавлена в корзину' };
    }

    // addCard(card: CardItem) {
    //     this.catalog.push(card);
    //     this.emitChanges('cardAdded', card);
    // }

    removeCard(cardId: string) {
        this.catalog = this.catalog.filter(card => card.id !== cardId);
        this.emitChanges('cardRemoved', { id: cardId });
    }

    get items(): ICard[] {
        return this.catalog;
    }

    setItems(items: CardItem[]) {
        this.catalog = items;
        this.emitChanges('itemsUpdated');
    }

    get cards(): ICard[] {
        return this.catalog;
    }

    getCard(cardId: string): ICard | undefined {
        return this.catalog.find(card => card.id === cardId);
    }


    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}