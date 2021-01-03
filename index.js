require('dotenv').config();
const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const expressHandlebars = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const productsRoutes = require('./routes/products')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express()

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGODB_URI
})

hbs._renderTemplate = function (template, context, options) {
  options.allowProtoMethodsByDefault = true;
  options.allowProtoPropertiesByDefault = true;
  return template(context, options);
};

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'some_value',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', homeRoutes)
app.use('/products', productsRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start(){
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    app.listen(PORT, () => {
      console.log(`Server is runnung on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
