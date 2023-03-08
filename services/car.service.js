
const fs = require('fs')

const gCars = require('../data/car.json')


module.exports = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 100

function query(filterBy = { vendor: '', page: 0 }) {
    const regex = new RegExp(filterBy.vendor, 'i')
    var cars = gCars.filter(car => regex.test(car.vendor))

    if(filterBy.page) {
        const startIdx = filterBy.page * PAGE_SIZE
        cars = cars.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(cars)
}

function getById(carId) {
    const car = gCars.find(car => car._id === carId)
    if (!car) return Promise.reject('Unknonwn car')
    return Promise.resolve(car)
}

function remove(carId, loggedinUser) {
    const idx = gCars.findIndex(car => car._id === carId)
    if (idx === -1) return Promise.reject('Unknonwn car')
    if (gCars[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your car')

    gCars.splice(idx, 1)
    return _saveCarsToFile()
}


function save(car, loggedinUser) {
    var savedCar
    if (car._id) {
        savedCar = gCars.find(currCar => currCar._id === car._id)
        if (!savedCar) return Promise.reject('Unknonwn car')
        if (savedCar.owner._id !== loggedinUser._id) return Promise.reject('Not your car')

        savedCar.vendor = car.vendor
        savedCar.speed = car.speed
    } else {
        savedCar = {
            _id: _makeId(),
            owner : loggedinUser,
            vendor: car.vendor,
            speed: car.speed,
        }
        gCars.push(savedCar)
    }
    return _saveCarsToFile().then(()=>{
        return savedCar
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gCars, null, 2)

        fs.writeFile('data/car.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
