const {Router} = require('express')
const Product = require('../models/product')
const router = Router()


router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add product',
    isAdd: true
  })
})

router.post('/', async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img
  })

  try {
    await product.save()
    res.redirect('/products')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router