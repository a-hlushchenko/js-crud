const express = require('express')
const router = express.Router()

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Track.createId()
    this.name = name
    this.author = author
    this.image = image
  }

  static createId() {
    const id = Math.round(Math.random() * 9999)
    if (this.#list.find((track) => track.id === id)) {
      this.createId()
    }

    return id
  }

  static getById = (id) =>
    this.#list.find((track) => track.id === id)

  static create(name, author, image) {
    const track = new Track(name, author, image)
    this.#list.push(track)
    return track
  }

  static getList = () => this.#list
}

Track.create(
  'Уночі',
  'YAKTAK',
  'https://i.scdn.co/image/ab67616d00001e025f6c5f25597a74b485359dfa',
)
Track.create(
  'Кити',
  'Volodymyr Dantes',
  'https://i.scdn.co/image/ab67616d00001e020b5615a0c35a0af02e85f198',
)
Track.create(
  'Paint The Town Red',
  'Doja Cat',
  'https://i.scdn.co/image/ab67616d00001e027acee948ecac8380c1b6ce30',
)
Track.create(
  'Уночі',
  'YAKTAK',
  'https://i.scdn.co/image/ab67616d00001e025f6c5f25597a74b485359dfa',
)
Track.create(
  'Кити',
  'Volodymyr Dantes',
  'https://i.scdn.co/image/ab67616d00001e020b5615a0c35a0af02e85f198',
)
Track.create(
  'Paint The Town Red',
  'Doja Cat',
  'https://i.scdn.co/image/ab67616d00001e027acee948ecac8380c1b6ce30',
)

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Playlist.createId()
    this.name = name
    this.tracks = []
    this.amount = 0
    this.image = '/img/mix-img.jpg'
  }

  static createId() {
    const id = Math.round(Math.random() * 9999)

    if (this.#list.find((track) => track.id === id))
      this.createId()

    return id
  }

  static create(name) {
    const playlist = new Playlist(name)
    this.#list.push(playlist)
    return playlist
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    const randomTracks = allTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)

    playlist.amount += 3
  }

  static getList = () => this.#list

  static getbyId = (id) =>
    this.#list.find((playlist) => playlist.id === id)

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
    this.amount -= 1
  }

  addTrackById(trackId) {
    this.tracks.push(Track.getById(trackId))
    this.amount += 1
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }

  static setPicture(playlist) {
    playlist.image =
      playlist.tracks.length > 0
        ? playlist.tracks[
            Math.floor(
              Math.random() * playlist.tracks.length,
            )
          ].image
        : '/img/mix-img.jpg'
  }
}

Playlist.makeMix(Playlist.create('Test 1'))
Playlist.create('Work Anton')
Playlist.makeMix(Playlist.create('Test2'))

router.get('/', function (req, res) {
  const list = User.getList()
  res.render('index', {
    style: 'index',

    data: {
      list,
      isEmpty: list.length === 0 ? true : false,
    },
  })
})

router.get('/spotify-create-list', function (req, res) {
  res.render('spotify-create-list', {
    style: 'spotify-create-list',
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву',
        link: isMix
          ? 'spotify-create?isMix=true'
          : 'spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getbyId(id)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Плейліст не знайдено',
        link: '',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const trackId = Number(req.query.trackId)
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getbyId(playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Плейліст не знайдено',
        link: `spotify-playlist?${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)
  Playlist.setPicture(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const tracks = Track.getList()

  if (!tracks) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Плейліст не знайдено',
        link: `spotify-playlist?${playlistId}`,
      },
    })
  }

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      tracks,
      playlistId,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  const trackId = Number(req.query.trackId)
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getbyId(playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: 'Плейліст не знайдено',
        link: `spotify-playlist?${playlistId}`,
      },
    })
  }
})

router.get('/product-list', function (req, res) {
  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: Playlist.getList(),
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value
  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: Playlist.findListByValue(value),
      value,
    },
  })
})

module.exports = router
