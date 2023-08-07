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


router.get('/', function (req, res) {

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

// Підключаємо роутер до бек-енду
module.exports = router
