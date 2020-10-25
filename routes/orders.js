const {Router} = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')

    res.render('orders', {
      title: 'Orders',
      isOrder: true,
      orders: orders.map(order => {
        return {
          ...order._doc,
          price: order.products.reduce((total, item) => {
            return total += item.product.price * item.count
          }, 0)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.productId')
      .execPopulate()
    
    const products = user.cart.items.map(item => ({
      count: item.count,
      product: {...item.productId._doc}
    }))

    const order = new Order({
      products: products,
      user: {
        name: req.user.name,
        userId: req.user
      }
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router