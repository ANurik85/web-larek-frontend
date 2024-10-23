import './scss/styles.scss';

import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { CardsData } from "./components/CardsData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { BasketView } from "./components/BasketView";
import { BasketItemView } from "./components/BasketItemView";
import { IFormAddress, IFormContacts, ICard, IProduct } from "./types";
import { Order } from "./components/Order";
import { Success } from "./components/Success";
import { BasketModel } from './components/BasketModel';
import { BasketCatalogModel } from './components/BasketCatalogModel';
import { OrderAddress } from './components/OrderAddress';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const cardsData = new CardsData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderContactsTemplate), events);
const orderAddress = new OrderAddress(cloneTemplate(orderAddressTemplate), events);
const basketModel = new BasketModel(events);
const basketCatalogModel = new BasketCatalogModel(events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events)

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

events.on('items:changed', () => {
    const cardsArray = cardsData.catalog.map((item) => {
        const cardContainer = cloneTemplate(cardCatalogTemplate);
        const cardInstance = new Card(cardContainer, events);
        cardInstance.render(item);

        cardContainer.addEventListener('click', () => {
            events.emit('card:select', item);
        });

        return cardContainer;
    });

    page.render({ catalog: cardsArray });
    // Обновление счетчика корзины
    const itemCount = basketModel.getItemCount();
    page.counter = itemCount;

});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    const total = basketModel.calculateTotal();
    // Получаем список id карточки, добавленных в корзину с фильтром на null 
    const items = basketModel.basket.filter(item => item.price !== null).map(item => item.id);
    // Подготовка данных для заказа
    const finalOrderData = {
        ...order.order,
        ...orderAddress.order,
        total,
        items,
    };

    api.orderCards(finalOrderData)
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate), events);
            modal.render({
                content: success.render({ total: basketModel.calculateTotal() }),
            });
            basketModel.clearBasket();
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IFormContacts>) => {
    const { email, phone } = errors;
    order.valid = !email && !phone;
    order.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IFormAddress>) => {
    const { address, payment } = errors;
    orderAddress.valid = !address && !payment;
    orderAddress.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
    if (!payment && !orderAddress.payment) {
        orderAddress.payment = 'card';
    }
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IFormContacts, value: string }) => {
    order.setOrderField(data.field as keyof IFormContacts, data.value);
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IFormAddress, value: string }) => {
    orderAddress.setAddressField(data.field as keyof IFormAddress, data.value);
});

// Открыть форму заказа способа оплаты
events.on('address:open', () => {
    modal.render({
        content: orderAddress.render({
            address: '',
            payment: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть форму заказа контакты
events.on('order:open', () => {
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть окно подтверждение
events.on('order:success', () => {
    modal.render({
        content: success.render({ total: basketModel.calculateTotal() }),
    });
});

// добавление карточки в корзину
events.on('basket:add', (event: { id: string }) => {
    const cardId = event.id;
    if (!cardId) {
        return;
    }
    const cardItem = cardsData.getCardItem(cardId);
    basketModel.addToBasket({ id: cardId, indexNumber: basketModel.getItemCount() + 1, title: cardItem.title, price: cardItem.price });
    basketModel.updateItemCount();
    basketModel.updateTotal();
    modal.close();
});

// удаление карточки из корзину
events.on('basket:remove', (event: { id: string }) => {
    basketModel.removeCard(event.id);
    page.counter = basketModel.getItemCount();
    const cardBasketArray = basketModel.basket.filter((card) => card.id !== event.id).map((card, index) => {
        const cardBasket = new BasketItemView(
            cloneTemplate(cardBasketTemplate),
            events
        );
        return cardBasket.render({
            id: card.id,
            title: card.title,
            price: card.price,
            indexNumber: index + 1,
        });
    });
    modal.render({
        content: basketView.render({
            items: cardBasketArray,
            total: basketModel.calculateTotal(),
        }),
    });
    basketModel.updateItemCount();
    basketModel.updateTotal();
});

// открываем модальное окно корзину
events.on('basket:open', () => {
    const basketContent = cloneTemplate(basketTemplate) as HTMLElement;
    const basketList = basketContent.querySelector('.basket__list');

    const cardBasketArray = basketModel.basket.map(product => {
        const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);
        basketItemView.render(product);
        return basketItemView.getElement();
    });

    cardBasketArray.forEach(element => {
        basketList.appendChild(element);
    });

    const total = basketModel.calculateTotal();
    const basketView = new BasketView(basketContent, events);
    // Проверка состояния корзины и установка состояния кнопки
    basketView.items = cardBasketArray;
    modal.render({
        content: basketView.render({ items: cardBasketArray, total })
    });
    basketModel.updateItemCount();
    basketModel.updateTotal();
});

// Открыть выбранный карточки
events.on('card:select', (item: ICard) => {
    const showItem = (item: ICard) => {
        const card = new Card(cloneTemplate(cardPreviewTemplate), events);
        const modalContent = card.render({ ...item });

        // Найдём кнопку и добавим функционал
        const addButtonCard = modalContent.querySelector('.card__button');
        const product = basketModel.basket.find((product: IProduct) => product.id === item.id);

        if (addButtonCard) {
            const updateButtonState = () => {
                addButtonCard.textContent = product ? 'Удалить из корзину' : 'В корзину';
            };
            updateButtonState();
            addButtonCard.addEventListener('click', async () => {
                try {
                    if (product) {
                        basketModel.removeCard(item.id);
                        events.emit('basket:remove', { id: item.id });
                        modal.close();
                    } else {
                        basketModel.addToBasket({ id: item.id, indexNumber: basketModel.getItemCount() + 1, title: item.title, price: item.price });
                        events.emit('basket:add', { id: item.id });
                    }
                    updateButtonState();
                } catch (error) {
                    console.error(error);
                }
            });
        }

        modal.render({ content: modalContent });
    };
    showItem(item);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Закрываем модалку Success
events.on('success:close', () => {
    modal.close();
});

// Получаем список карточки с сервера
api.getCardList()
    .then(cardsData.setCatalog.bind(cardsData))
    .then(basketCatalogModel.setItems.bind(basketCatalogModel))
    .catch(err => {
        console.error(err);
    });
