import { carService } from '../services/car.service.js'

import CarFilter from '../cmps/CarFilter.js'
import CarList from '../cmps/CarList.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'

export default {
    template: `
        <section class="car-index">
            <RouterLink to="/car/edit">Add a car</RouterLink>
            <CarFilter @filter="setFilterBy"/>
            <CarList 
                :cars="cars" 
                @remove="removeCar" />
            <button @click="getPage(-1)">Prev</button>
            <button @click="getPage(1)">Next</button>
          
        </section>
    `,
    data() {
        return {
            cars: [],
            filterBy: { vendor: '', page: 0 },
        }
    },
    created() {
        this.loadCarsLater = utilService.debounce(this.loadCars, 500)
        this.loadCars()
    },
    methods: {
        loadCars() {
            carService.query(this.filterBy)
                .then(cars => this.cars = cars)
        },
        getPage(dir) {
            this.filterBy.page += dir
            if(this.filterBy.page < 0) this.filterBy.page = 0
            this.loadCars()
        },
        removeCar(carId) {
            carService.remove(carId)
                .then(() => {
                    const idx = this.cars.findIndex(car => car._id === carId)
                    this.cars.splice(idx, 1)
                    showSuccessMsg('Car removed')
                })
                .catch(err => {
                    showErrorMsg('Car remove failed')
                })
        },
        setFilterBy(filterBy) {
            this.filterBy = filterBy
            this.loadCarsLater()
        }
    },
    computed: {
        filteredCars() {
            const regex = new RegExp(this.filterBy.vendor, 'i')
            return this.cars.filter(car => regex.test(car.vendor))
        }
    },

    components: {
        CarFilter,
        CarList,
    }
}