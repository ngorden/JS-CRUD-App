const express = require('express')
const database = require('../db/pool')

const router = express.Router()

router.get('/', (req, res) => {
    database.find({}, (err, docs) => {
        if (err) res.status(500).render('error', { message: err.message })
        docs.sort((a, b) => a.priority - b.priority)
        res.render('all', { todos: docs })
    })
})

router.post('/', (req, res) => {
    if (validTodo(req.body)) {
        let todo = {
            title: req.body.title, description: req.body.description,
            done: false, priority: req.body.priority, date: new Date()
        }
        database.insert(todo, (err, doc) => {
            if (err) res.render('error', { message: err.message })
            res.render('single', { todo: doc })
        })
    } else
        res.status(500).render('error', { message: 'Invalid Todo' })
})

router.get('/new', (req, res) => {
    res.render('new')
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    database.findOne({ _id: id }, (err, doc) => {
        if (err) res.status(500).render('error', { message: err.message })
        res.render('single', { todo: doc })
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    database.remove({ _id: id }, (err, docs) => {
        if (err) res.status(500).render('error', { message: 'Invalid Query' })
        res.redirect('/todo')
    })
})

function validTodo(todo) {
    return typeof todo.title === 'string' &&
        todo.title.trim() !== '' &&
        typeof todo.priority !== 'undefined' &&
        !isNaN(todo.priority)
}

module.exports = router
