const express = require('express')
const router = express.Router()

class Product {
  static #list = [];
  static #count = 0;

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count;
    this.img = img;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.amount = amount;
  }

  static add = (...data) => {
    const newProduct = new Product(...data);

    this.#list.push(newProduct);
  }

  static getList = () => Product.#list;

  static getById = (id) => this.#list.find((product) => product.id === id);

  static getRandomList = (id) => {
    const filteredList = this.#list.filter((product) => product.id !== id);
    const shuffledList = filteredList.sort((product) => Math.random() - 0.5);

    return shuffledList.slice(0, 3);
  }
}

Product.add('https://picsum.photos/375/390', `1 Комп'ютер Artline Gaming (X43v31)`, `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`, [{id: 1, text: 'Готовий до відправки'}, {id: 2, text: 'Топ продажів'}], 27000, 7);
Product.add('https://picsum.photos/375/390', `2 Комп'ютер COBRA Advanced (I11F.8.H1S2)`, `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`, [{id: 1, text: 'Готовий до відправки'}], 32499, 4);
Product.add('https://picsum.photos/375/390', `3 Комп'ютер  Gaming (TUFv119)`, `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`, [{id: 2, text: 'Топ продажів'}], 42999, 12);
Product.add('https://picsum.photos/375/390', `4 Комп'ютер ARTLINE  (TUFv119)`, `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`, [{id: 2, text: 'Топ продажів'}], 42999, 9);
Product.add('https://picsum.photos/375/390', `5 Комп'ютер ARTLINE Gaming TUF  (TUFv119)`, `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`, [{id: 2, text: 'Топ продажів'}], 42999, 4);
Product.add('https://picsum.photos/375/390', `6 Комп'ютер  Gaming  v119 (TUFv119)`, `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`, [{id: 2, text: 'Топ продажів'}], 42999, 22);

class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.05;

  static #list = [];
  static #count = 0;

  static #bonusAccountsList = new Map();

  static getBonusBalance = (email) => this.#bonusAccountsList.get(email) || 0;
  
  static calcBonus = (price) => Math.floor(price * this.#BONUS_FACTOR);

  static updateBonusBalance = (email, price, useBonus) => {
    const amount = this.calcBonus(price);
    const currentBonusBalance = this.getBonusBalance(email);
    const updateBonusBalance = currentBonusBalance + amount - useBonus;
    this.#bonusAccountsList.set(email, updateBonusBalance);

    return amount;
  }

  constructor(data, product) {
    this.id = ++Purchase.#count;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.phone = data.phone;
    this.email = data.email;
    this.comment = data.comment || null;
    this.bonus = data.bonus || 0;
    this.getBonus = data.getBonus;
    this.promocode = data.promocode || null;
    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;
    this.product = product;
  }

  static add = (...data) => {
    const newPurchase = new Purchase(...data);

    this.#list.push(newPurchase);

    return newPurchase;

  }


  static getList = () => this.#list.reverse();

  static getById = (id) => this.#list.find((purchase) => purchase.id === id);

  static update = (id, data) => {
    const purchase = this.getById(id);

    if (purchase) {
      if (data.firstname) purchase.firstname = data.firstname;
      if (data.lastname) purchase.lastname = data.lastname;
      if (data.phone) purchase.phone = data.phone;
      if (data.email) purchase.email = data.email;

      return true;
    }

    return false;
  }
}

class Promocode {
  static #list = [];

  constructor(name, factor) {
    this.name = name;
    this.factor = factor;
  }

  static add(name, factor) {
    const promocode = new Promocode(name, factor);
    this.#list.push(promocode);
    return promocode;
  }

  static getByName = (name) => this.#list.find((promocode) => promocode.name === name.toUpperCase());

  static calc = (promo, price) => price - price / 100 * promo.factor;
}

Promocode.add('DISCOUNT10', 10);
Promocode.add('KYIV1541', 20);
Promocode.add('FIRSTSALE', 5);

const product = Product.getById(1);

Purchase.add({totalPrice: 3000, productPrice: 2850, deliveryPrice: 150, amount: 2, firstname: 'Anton', lastname: 'Hlushchenko', phone: '+380683266551', email: 'glantoshka@gmail.com', promocode: 'KYIV1541', getBonus: 120}, product);
Purchase.add({totalPrice: 3000, productPrice: 2850, deliveryPrice: 150, amount: 2, firstname: 'Anton', lastname: 'Hlushchenko', phone: '+380683266551', email: 'glantoshka@gmail.com', promocode: 'KYIV1541', getBonus: 120}, product);
Purchase.add({totalPrice: 3000, productPrice: 2850, deliveryPrice: 150, amount: 2, firstname: 'Anton', lastname: 'Hlushchenko', phone: '+380683266551', email: 'glantoshka@gmail.com', promocode: 'KYIV1541', getBonus: 120}, product);

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',

    data: Product.getList(),
  })
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id);

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    }
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id);
  const amount = Number(req.body.amount);

  const product = Product.getById(id);

  const productPrice = product.price * amount;
  const deliveryPrice = Purchase.DELIVERY_PRICE;
  const totalPrice = productPrice + deliveryPrice;
  const bonus = Purchase.calcBonus(totalPrice);

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      priceDetails: [
        {text: `${product.title} (${amount}шт.)`, price: productPrice},
        {text: 'Вартість доставки', price: deliveryPrice},
      ],
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
    }
  })
})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id);
  const product = Product.getById(id);

  let {totalPrice, productPrice, deliveryPrice, amount, firstname, lastname, phone, email, promocode, bonus} = req.body;

  totalPrice = Number(totalPrice);
  productPrice = Number(productPrice);
  deliveryPrice = Number(deliveryPrice);
  amount = Number(amount);
  bonus = Number(bonus);

  if (product.amount < amount) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Данного товару немає в наявності',
        link: 'purchase-list',
      }
    })
  }

  product.amount -= amount;

  if (!product) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Данний товар не існує',
        link: 'purchase-list',
      }
    })
  }

  if (isNaN(totalPrice) || isNaN(productPrice) || isNaN(deliveryPrice)  || isNaN(bonus)) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні данні',
        link: 'purchase-list',
      }
    })
  }

  if (bonus) {
    const availableBonus = Purchase.getBonusBalance(email);

    if (bonus > availableBonus) {
      bonus = availableBonus;
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus);
    totalPrice -= bonus;
  } else Purchase.updateBonusBalance(email, totalPrice, 0);

  if (promocode) {
    promocode = Promocode.getByName(promocode);

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) {
    totalPrice = 0;
  }

  getBonus = Purchase.calcBonus(totalPrice);

  const purchase = Purchase.add({totalPrice, productPrice, deliveryPrice, amount, firstname, lastname, phone, email, promocode, bonus, getBonus}, product);
  console.log(purchase);

  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Створення успішне',
      info: 'Замовлення оформлено',
      link: 'purchase-list',
    }
  })
})

router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    data: Purchase.getList(),
  })
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id);
  const purchase = Purchase.getById(id);
  res.render('purchase-info', {
    style: 'purchase-info',
    data: purchase,
  })
})

router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id);
  const purchase = Purchase.getById(id);
  res.render('purchase-update', {
    style: 'purchase-update',
    data: purchase,
  })
})

router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id);
  Purchase.update(id, req.body);

  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Успішно',
      info: 'Данні до замовлення змінено',
      link: 'purchase-list',
    }
  })
})

module.exports = router
