const {Router} = require('express')
const Product = require('../models/product')
const router = Router();


router.get('/', async (req, res) => {
  const products = await Product.find()
    .populate('userId', 'email name')
    .select('title price img')

  res.render('products', {
    title: 'Products',
    isProducts: true,
    products
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const product = await Product.findById(req.params.id)

  res.render('product-edit', {
    title: `Edit ${product.title}`,
    product
  })
})

router.post('/edit', async (req, res) => {
  const {id} = req.body
  delete req.body.id
  await Product.findByIdAndUpdate(id, req.body)
  res.redirect('/products')
})

router.post('/remove', async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.body.id
    })
    res.redirect('/products')
  } catch(error) {
    console.log(error)
  }
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.render('product', {
    layout: 'empty',
    title: `Product ${product.title}`,
    product
  })
})

module.exports = router