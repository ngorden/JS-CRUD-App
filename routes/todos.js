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

module.exports = router
