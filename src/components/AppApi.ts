import { IApi, ICard, IForm, TCardfull, TUserBaseInfo } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCards(): Promise<ICard[]> {
		return this._baseApi.get<ICard[]>(`/product`).then((cards: ICard[]) => cards);
	}

	getForm(): Promise<IForm> {
		return this._baseApi.get<IForm>(`/order`).then((user: IForm) => user);
	}

	addCard(data: TCardfull): Promise<ICard> {
		return this._baseApi.post<ICard>(`/product`, data).then((card: ICard) => card);
	}

	removeCard(cardID: string): Promise<{ message: string }> {
		return this._baseApi.post<{ message: string }>(`/product/${cardID}`, {}, 'DELETE').then(
			(res: { message: string }) => res
		);
	}

	setPage(data: TUserBaseInfo): Promise<IForm> {
		return this._baseApi.post<IForm>(`/order`, data, 'PATCH').then((res: IForm) => res);
	}


}


/* import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, ILot, LotUpdate, IBid} from "../types";

export interface IAuctionAPI {
    getLotList: () => Promise<ILot[]>;
    getLotItem: (id: string) => Promise<ILot>;
    getLotUpdate: (id: string) => Promise<LotUpdate>;
    placeBid(id: string, bid: IBid): Promise<LotUpdate>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getLotItem(id: string): Promise<ILot> {
        return this.get(`/lot/${id}`).then(
            (item: ILot) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotUpdate(id: string): Promise<LotUpdate> {
        return this.get(`/lot/${id}/_auction`).then(
            (data: LotUpdate) => data
        );
    }

    getLotList(): Promise<ILot[]> {
        return this.get('/lot').then((data: ApiListResponse<ILot>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeBid(id: string, bid: IBid): Promise<LotUpdate> {
        return this.post(`/lot/${id}/_bid`, bid).then(
            (data: ILot) => data
        );
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

} */