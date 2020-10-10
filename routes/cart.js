const {Router} = require('express')
const router = Router()
const Cart = require('../models/cart')
const Product = require('../models/product')


router.post('/add', async (req, res) => {
  const product = await Product.getById(req.body.id)
  await Cart.add(product)
  res.redirect('/cart')
})

router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id)
  res.status(200).json(cart)
})

router.get('/', async (req, res) => {
  const cart = await Cart.fetch()
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    products: cart.products,
    price: cart.price
  })
})

module.exports = router