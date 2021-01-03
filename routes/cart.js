const {Router} = require('express')
const router = Router()
const Product = require('../models/product')
const auth = require('../middleware/auth')

function mapCartItems(cart) {
  return cart.items.map(item => ({
    ...item.productId._doc,
    id: item.productId.id,
    count: item.count
  }))
}

function computePrice(products) {
  return products.reduce((total, product) => {
    return total += product.price * product.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  const product = await Product.findById(req.body.id)
  await req.user.addToCart(product)
  res.redirect('/cart')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user
    .populate('cart.items.productId')
    .execPopulate()

  const products = mapCartItems(user.cart)
  const cart = {
    products,
    price: computePrice(products)
  }
  res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.productId')
    .execPopulate()

  const products = mapCartItems(user.cart)

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    products: products,
    price: computePrice(products)
  })
})

module.exports = router