const nodemailer = require('nodemailer')
const fs = require('fs')

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE,
  secureConnection: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    // rejectUnauthorized: true
    ciphers: 'SSLv3'
  }
})

const sendEmail = async ({ optionsTransporter, deleteFile }) => {
  return new Promise((resolve, reject) => {
    emailTransporter.sendMail(optionsTransporter, (err) => {
      if (err) {
        console.log(err)
        if (optionsTransporter?.attachments && Array.isArray(optionsTransporter.attachments) && deleteFile === true) {
          optionsTransporter.attachments.forEach(fileItem => {
            fs.unlinkSync(fileItem.path)
          })
        }
        reject('Opps something wrong when send email')
      } else {
        if (optionsTransporter?.attachments && Array.isArray(optionsTransporter.attachments) && deleteFile === true) {
          optionsTransporter.attachments.forEach(fileItem => {
            fs.unlinkSync(fileItem.path)
          })
        }
        resolve('email sent')
      }
    })
  })
}

module.exports = sendEmail