import _ from "lodash";
import { Model } from "./base/Model";
import { ICardsData, ICard, IOrder, IProduct } from "../types";
import { Card } from "./Card";

export class CardsData extends Model<ICardsData> {

    catalog: ICard[] = [];
    loading: boolean;
    order: IOrder;
    preview: string | null = null;
    
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
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('card:select', item);
    }

    get items(): ICard[] {
        return this.catalog;
    }

    setItems(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('itemsUpdated');
    }

    get cards(): ICard[] {
        return this.catalog;
    }

    getCard(cardId: string): ICard | undefined {
        return this.catalog.find(card => card.id === cardId);
    }
}