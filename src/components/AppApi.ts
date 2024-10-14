import { Api, ApiListResponse, ApiPostMethods } from './base/api';
import { ICard, IOrder, IOrderResult } from "../types";

export interface IAPI {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
    getCardList: () => Promise<ICard[]>;
    getCardItem: (id: string) => Promise<ICard>;
    orderCards(order: IOrder): Promise<IOrderResult>;
}

export class AppApi extends Api implements IAPI {

    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICard> {
        return this.get<ICard>(`/product/${id}`).then(
            (item: ICard) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getCardList(): Promise<ICard[]> {
        return this.get<ApiListResponse<ICard>>('/product/').then((data) =>
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