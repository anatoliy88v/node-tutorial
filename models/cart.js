const path = require('path')
const fs = require('fs')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

class Cart {
  static async add(product) {
    const cart = await Cart.fetch()

    const idx = cart.products.findIndex(item => item.id === product.id)
    const newProduct = cart.products[idx]

    if (newProduct) {
      // check if product already in the cart and ++ it quantity
      newProduct.count++
      cart.products[idx] = newProduct
    } else {
      // add product to the cart
      product.count = 1
      cart.products.push(product)
    }

    cart.price += +product.price

    return new Promise ((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async remove(id) {
    const cart = await Cart.fetch()
    const idx = cart.products.findIndex(c => c.id === id)
    const product = cart.products[idx]

    if (product.count === 1) {
      // delete
      cart.products = cart.products.filter(c => c.id !== id)
    } else {
      // change quantity
      cart.products[idx].count--
    }

    cart.price -= product.price

    return new Promise ((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), err => {
        if (err) {
          reject(err)
        } else {
          resolve(cart)
        }
      })
    })
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(content))
        }
      })
    })
  }
}

module.exports = Cart