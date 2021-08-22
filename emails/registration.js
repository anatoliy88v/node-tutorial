require('dotenv').config();

module.exports = function(email) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Registration successful',
    html: `
      <h1>Hello from node-express-shop!</h1>
      <p>Your account ${email} was created</p>
      <hr />
      <a href="${process.env.BASE_URI}">${process.env.BASE_URI}</a>
    `
  }
}