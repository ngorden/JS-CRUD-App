const Datastore = require('nedb')
const path = require('path')

const db = new Datastore({ filename: path.resolve(__dirname, 'todo.db'), autoload: true })
module.exports = {
    db,
    down: () => {
        db.remove({}, (err, n) => {
            if (err) console.error(err)
            else console.log('%d items removed', n)
        })
    },

    up: function () {
        db.find({}, (err, docs) => {
            if (err) {
                console.error(err)
                return
            }
            if (docs.length === 0) {
                db.insert([{
                    title: 'Build CRUD App',
                    priority: 1, description: '',
                    date: new Date(), done: true
                }, {
                    title: 'Render the Views',
                    priority: 2, description: '',
                    date: new Date(), done: true
                }], (err, docs) => {
                    if (err) console.error(err)
                    else console.log('%d docs inserted', docs.length)
                })
            }
        })
    }
}
