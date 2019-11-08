const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const hbs = require('hbs')
hbs.registerHelper('select', function (selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"'
    )
})

app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
    let err = new Error('404 - Not Found')
    err.status = 404
    next(err)
})

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
