require('dotenv').config();
const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const router = Router()
const User = require('../models/user')
const regEmail = require('../emails/registration')

const transporter = nodemailer.createTransport(sendgrid({
  auth: {api_key: process.env.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Invalid password')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'User with such email does not exist')
      res.redirect('/auth/login#login')
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, name, password, repeat} = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      req.flash('registerError', 'User with this email already exists')
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: {items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
      await transporter.sendMail(regEmail(email))
    }
  } catch(err) {
    console.log(err)
  }
})

module.exports = router