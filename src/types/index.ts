export interface ICard {
  id: string;
  description: string;
  title: string;
  category: string;
  price: number;

}
export interface IForm {
  address: string;
  phone: string;
  email: string;
  sum?: number;
  payment?: string;
}
export interface ICardsData {
  cards: ICard[];
  preview: string | null;
  getCard(cardId: string): ICard;
  addBasketCard(BasketCard: TBasketCard): void;
}

export interface IForm {
  getBasketCard(): TBasketCard[];
  deleteBasketCard(cardId: string): void;
  checkFormValidation(data: Record<keyof TValidationInfo, string>): boolean;
  reserFormInput(data: Record<keyof TValidationInfo, string>): void;
  placeholderFormInput(data: Record<keyof TValidationInfo, string>): void;
  checkAddress(value: string): boolean;
  checkPhone(value: string) : boolean; 
  checkEmail(value: string): boolean;
}


export type TCardfull = Pick<ICard, 'title' | 'description' | 'category' | 'price'>;
export type TBasketForm = Pick<IForm, 'sum'> & Pick<ICard, 'title' | 'price'>;
export type TPaymentForm = Pick<IForm, 'address' | 'payment'>;
export type TСontactsForm = Pick<IForm, 'email' | 'phone'>;
export type TOrderSuccess = Pick<IForm, 'sum'>;
export type TBasketCard = Pick<ICard, 'title' | 'price'>;
export type TValidationInfo = Pick<IForm, 'email' | 'phone' | 'address'>;

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}



/* 
export type LotStatus = 'wait' | 'active' | 'closed';

export interface IAuction {
    status: LotStatus;
    datetime: string;
    price: number;
    minPrice: number;
    history?: number[];
}

export interface ILotItem {
    id: string;
    title: string;
    about: string;
    description?: string;
    image: string;
}

export type ILot = ILotItem & IAuction;

export type LotUpdate = Pick<ILot, 'id' | 'datetime' | 'status' | 'price' | 'history'>;

export type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'> & {
    isMyBid: boolean
};

export interface IAppState {
    catalog: ILot[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBid {
    price: number
}

export interface IOrderResult {
    id: string;
} */