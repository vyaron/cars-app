import CarPreview from './CarPreview.js'
import { userService } from "../services/user.service.js"

export default {
    props:['cars'],
    template: `
        <section class="car-list">
            <ul>
                <li v-for="car in cars" :key="car._id">
                    <CarPreview :car="car"/>
                    <RouterLink :to="'/car/'+car._id">Details</RouterLink>
                    <RouterLink v-if="isOwner(car)" :to="'/car/edit/'+car._id">Edit</RouterLink>
                    <button v-if="isOwner(car)" @click="remove(car._id)">x</button>
                </li>
            </ul>
        </section>
    `,
    methods: {
        remove(carId) {
            this.$emit('remove', carId)
        },
        showDetails(carId){
            this.$emit('show-details', carId)
        },
        isOwner(car){
            const user = userService.getLoggedInUser()
            if (!user) return false
            if (user._id !== car.owner._id) return false
            return true
        }
    },
    components: {
        CarPreview,
    }
}