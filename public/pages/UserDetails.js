import { userService } from "../services/user.service.js"

export default {
    template: `
        <section class="user-details" v-if="user">
            <h5 v-if="isMyProfile">My Profile</h5>
            <pre>{{user}}</pre>    
        </section>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser(),
            user: null
        }
    },
    created() {
        this.loadUser()
    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        }
    },
    watch: {
        userId() {
            this.loadUser()
        }
    },
    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        }
    }
}