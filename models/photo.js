var photos = []

module.exports = {
  create: create,
  all: all,
}

function all() {
  return Promise.resolve(photos)
}

function create(photo) {
  return Promise.resolve().then(() => {
    photos.push(photo)
    return photo
  })
}
