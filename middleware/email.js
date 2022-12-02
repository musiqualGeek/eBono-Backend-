const nodemailer = require('nodemailer')
const handlebar = require('nodemailer-express-handlebars');
const path = require('path');


module.exports = function sendMail(mail,title,subject,template){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ebono.org@gmail.com",
            pass: "qopevwmrmmwosmjx"
        }
    })

    const handlebarOptions = {
        viewEngine: {
            extName:".handlebars",
            partialsDir: path.resolve('./views'),
            defaultLayout:false
        },
        viewPath:path.resolve('./views'),
        extName:".handlebars"
    }

    transporter.use('compile',handlebar(handlebarOptions))

    const mailOptions = {
        from: "ebono.org@gmail.com",
        to: mail,
        subject: subject,
        text: "Donot Reply To This Email",
        template: template,
        context: {
            title:title
        }
    }

    transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email Sent')
        }
    })
}
