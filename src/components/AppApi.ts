import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, ICard} from "../types";

export interface IAPI {
    getCardList: () => Promise<ICard[]>;
    getCardItem: (id: string) => Promise<ICard>;
    orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderCards(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}