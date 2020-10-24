require('dotenv').config();
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const expressHandlebars = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const productsRoutes = require('./routes/products')
const addRoutes = require('./routes/add')
const User = require('./models/user')

const app = express()

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

hbs._renderTemplate = function (template, context, options) {
  options.allowProtoMethodsByDefault = true;
  options.allowProtoPropertiesByDefault = true;
  return template(context, options);
};

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5f8ac9ff25dfdb0aeddc17bf')
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/products', productsRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

async function start(){
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'test@test.com',
        name: 'TestName',
        cart: {items: []}
      })
      await user.save()
    }
    app.listen(PORT, () => {
      console.log(`Server is runnung on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
