const {Router} = require('express')
const Product = require('../models/product')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add product',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  })

  try {
    await product.save()
    res.redirect('/products')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router