const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const expressHandlebars = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const productsRoutes = require('./routes/products')
const addRoutes = require('./routes/add')

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

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/products', productsRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

async function start(){
  try {
    const url = `mongodb+srv://anatoliy:GmiDVufQ8qs75G4g@cluster0.zf6un.mongodb.net/shop`
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    app.listen(PORT, () => {
      console.log(`Server is runnung on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
