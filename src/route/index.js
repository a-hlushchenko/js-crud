// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
	static #list = [];

	constructor(email, login, password) {
		this.email = email;
		this.login = login;
		this.password = password;
		this.id = new Date().getTime();
	}

	static add = (user) => {
		this.#list.push(user);
	}

	static getList = () => {
		return this.#list;
	}

	static getById = (id) => this.#list.find((user) => user.id === id);

	static deleteById = (id, password) => {
		const index = this.#list.findIndex((user) => user.id === id);

		if (index >= 0 && password === this.#list[index].password) {
			this.#list.splice(index, 1);
			return true;
		};

		return false;
	}

	static updateById = (id, email, password) => {
		const user = this.getById(id);

		if (user && email && password === user.password) {
			user.email = email;
			return true;
		}

		return false;
	}
}

class Product {
	static createId = () => {
		const randomId = Math.floor(Math.random() * 100000);
		const haveId = this.#list.find((value) => value.id === randomId);

		if(haveId) {
			return this.createId();
		}

		return randomId;
	}

	constructor(name, price, description) {
		this.name = name;
		this.price = price;
		this.description = description;
		this.id = Product.createId();
		this.createDate = new Date();
	}

	static #list = [
		{name: 'Anton', price: 9999, description: 'Best bro!', id: 10000},
		{name: 'Yaroslav', price: 9998, description: 'Very good bro)', id: 10001},
	];

	static getList = () => {
		return this.#list;
	}

	static add = (product) => {
		this.#list.push(product);
	}

	static getById = (id) => this.#list.find((value) => value.id === id);

	static updateById = (id, {name, price, description}) => {
		const product = this.getById(id);
		if(name) {product.name = name};
		if (price) {product.price = price};
		if (description) {product.description = description};
	};

	static deleteById = (id) => {
		
		const index = this.#list.findIndex((value) => value.id === id);

		if (index >= 0) {
			this.#list.splice(index, 1);
			return true;
		}

		return false;
	};
}

router.get('/user-create', function (req, res) {

	const list = User.getList();
  res.render('index', {
    style: 'index',

	data: {
		users: {
			list,
			isEmpty: list.length === 0,
		}
	}
  })
})


router.post('/user-create', function (req, res) {
	const {email, login, password} = req.body;

	const user = new User(email, login, password);

	User.add(user);
	
	console.log(User.getList());

  res.render('info', {
    style: 'info',
	info: 'користувача створено',
  })
})

router.get('/user-del', function (req, res) {
	const {id} = req.query;

	const user = User.getById(Number(id));

  res.render('del', {
    style: 'del',
	user,
  })
})

router.post('/user-delete', function (req, res) {
	const {firstId} = req.query;
	const{id, password} = req.body;

	let result = false;

	if (firstId === id) {
		result = User.deleteById(Number(id), password);
	}

  res.render('info', {
    style: 'info',
	info: result ? 'користувача видалено' : 'сталась помилка',
  })
})

router.get('/user-upd', function (req, res) {
	const {id} = req.query;

	const user = User.getById(Number(id));

  res.render('upd', {
    style: 'upd',
	user,
  })
})

router.post('/user-update', function (req, res) {
	const{firstId} = req.query;
	const {email, password, id} = req.body;

	let result = false;

	if (firstId === id) {
		result = User.updateById(Number(id), email, password);
	}

  res.render('info', {
    style: 'info',
	info: result ? 'пошту користувача оновлено' : 'сталась помилка',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

router.post('/product-create', function (req, res) {
	const {name, price, description} = req.body;

	const product = new Product(name, price, description);

	Product.add(product);

  res.render('alert', {
    style: 'alert',
	alert: 'Товар усішно додано',
  })
})

router.get('/', function (req, res) {

	const list = Product.getList();
	
  res.render('product-list', {
    style: 'product-list',

	list,
	isEmpty: list.length === 0,
  })
})

router.get('/product-edit', function (req, res) {
	const {id} = req.query;

	const product = Product.getById(Number(id));

	if(product) {
	
		res.render('product-edit', {
			style: 'product-edit',

			product,
		})
	} else {
		res.render('alert', {
			style: 'alert',

			alert: 'Товар з таким ID не знайдено',
		})
	}
})

router.post('/product-edit', function (req, res) {
	const {name, price, id, description} = req.body;

	Product.updateById(Number(id), {name, price, description});

  res.render('alert', {
    style: 'alert',
	alert: 'Товар усішно змінено',
  })
})

router.get('/product-delete', function (req, res) {
	const {id} = req.query;

	const result = Product.deleteById(Number(id));
	
  res.render('alert', {
    style: 'alert',
	alert: result? 'Товар успішно видалено' : 'Сталась помилка',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
