const express = require('express')
const database = require('../db/pool').db

const router = express.Router()

router.get('/', (req, res) => {
    database.find({}, (err, docs) => {
        if (err) res.status(500).render('error', { message: err.message })
        docs.sort((a, b) => a.priority - b.priority)
        res.render('all', { todos: docs })
    })
})

router.post('/', (req, res) => {
    validateTodoRenderError(req, res, todo => {
        todo.done = false
        database.insert(todo, (err, doc) => {
            if (err) res.render('error', { message: err.message })
            res.render('single', { todo: doc })
        })
    })
})

router.get('/new', (req, res) => {
    res.render('new')
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    respondAndRenderTodo(id, res, 'single')
})
router.put('/:id', (req, res) => {
    validateTodoRenderError(req, res, todo => {
        let id = req.params.id
        todo.done = typeof req.body.done !== 'undefined'
        database.update({ _id: id }, todo, {}, (err, n, upsert) => {
            if (err) res.status(500).render('error', { message: err.message })
            res.redirect(`/todo/${id}`)
        })
    })
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    database.remove({ _id: id }, (err, docs) => {
        if (err) res.status(500).render('error', { message: 'Invalid Query' })
        res.redirect('/todo')
    })
})

router.get('/:id/edit', (req, res) => {
    let id = req.params.id
    respondAndRenderTodo(id, res, 'edit')
})

function respondAndRenderTodo(id, res, viewName) {
    database.findOne({ _id: id }, (err, doc) => {
        if (err) res.status(500).render('error', { message: err.message })
        res.render(viewName, { todo: doc })
    })
}

function validTodo(todo) {
    return typeof todo.title === 'string' &&
        todo.title.trim() !== '' &&
        typeof todo.priority !== 'undefined' &&
        !isNaN(todo.priority)
}

function validateTodoRenderError(req, res, callback) {
    if (validTodo(req.body))
        callback({
            title: req.body.title, description: req.body.description,
            priority: req.body.priority, date: new Date()
        })
    else
        res.status(500).render('error', { message: 'Invalid Todo' })
}

module.exports = router
