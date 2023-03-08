'use strict'

import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const CAR_KEY = 'carDB'

_createCars()

export const carService = {
    query,
    get,
    remove,
    save,
    getEmptyCar,
}

function query(filterBy = {}) {

    return axios.get(`/api/car`, { params: filterBy })
        .then(res => res.data)
}


function get(carId) {
    return axios.get(`/api/car/${carId}`)
        .then(res => res.data)

    // return storageService.get(CAR_KEY, carId)
    //     .then(_setNextPrevCarId)
}

function remove(carId) {
    return axios.delete(`/api/car/${carId}`)
        .then(res => res.data)
}

function save(car) {
    if(car._id) {
        return axios.put(`/api/car/${car._id}`, car)
            .then(res => res.data)
    } else {
        return axios.post(`/api/car`, car)
            .then(res => res.data)
    }
}

function getEmptyCar(vendor = '', speed = 0) {
    return { _id: '', vendor, speed }
}

function _createCars() {
    let cars = utilService.loadFromStorage(CAR_KEY)
    if (!cars || !cars.length) {
        cars = []
        cars.push(_createCar('audu', 300))
        cars.push(_createCar('fiak', 120))
        cars.push(_createCar('subali', 100))
        cars.push(_createCar('mitsu', 150))
        utilService.saveToStorage(CAR_KEY, cars)
    }
}

function _createCar(vendor, speed = 250) {
    const car = getEmptyCar(vendor, speed)
    car._id = utilService.makeId()
    return car
}

