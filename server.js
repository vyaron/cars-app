const express = require('express')
// const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()


const carService = require('./services/car.service')
const userService = require('./services/user.service')

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))


// app.get('/', (req, res) => {
//     res.send('Hello World!!')
// })

app.get('/puki', (req, res) => {
    var visitCount = req.cookies.visitCount || 0
    visitCount++
    res.cookie('visitCount', visitCount)

    res.send('Hello Puki')
})

app.get('/nono', (req, res) => {
    res.redirect('/puki')
})

// Car API

app.get('/api/car', (req, res) => {
    const filterBy = {
        vendor: req.query.vendor || '',
        page: req.query.page || 0,
    }
    carService.query(filterBy)
        .then(cars => {
            res.send(cars)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load cars')
        })

})

app.put('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { _id, vendor, speed } = req.body
    const car = { _id, vendor, speed }

    carService.save(car, loggedinUser)
        .then(savedCar => {
            res.send(savedCar)
        })
        .catch(err => {
            console.log('Cannot save car, Error:', err)
            res.status(400).send('Cannot save car')
        })
})

app.post('/api/car', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { vendor, speed } = req.body
    const car = { vendor, speed }

    carService.save(car, loggedinUser)
        .then(savedCar => {
            res.send(savedCar)
        })
        .catch(err => {
            console.log('Cannot save car, Error:', err)
            res.status(400).send('Cannot save car')
        })
})

app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params
    carService.getById(carId)
        .then(car => {
            res.send(car)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load car')
        })
})

app.delete('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove car')

    const { carId } = req.params
    carService.remove(carId, loggedinUser)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove car')
        })
})

// Users

app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load users')
        })

})

app.put('/api/user/:userId', (req, res) => {
    const { _id, username, fullname, password } = req.body
    const user = { _id, username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})



const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`CarApp listening on: http://localhost:${port}`)
})

