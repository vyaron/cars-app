import { utilService } from "../services/util.service.js"



export default {
    template: `
        <section class="home-page">
            <h2 ref="myTitle">Home</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis enim rem porro delectus. Quos expedita ipsam repellendus voluptas quas, nam ea eligendi veniam ullam, modi impedit eveniet quia quaerat molestias?</p>
            <input type="number" placeholder="Importance" v-model.number="quest.importance"  />
            <input type="text" placeholder="Your question" v-model="quest.txt"  />
            <button @click="animateTitle">Just Button</button>
            <hr />
            <Component :is="titleType">Our Home is Here</Component>
            <select v-model="titleType">
                <option>h1</option>
                <option>h5</option>
                <option>p</option>
                <option>div</option>
            </select>
        </section>
    `,
    data() {
        return {
            quest: {
                importance: 8,
                txt: ''
            },
            titleType: 'h1'
        }
    },
    created() {
    },
    // Default watch is shallow
    watch: {
        // quest() {
        //     console.log('Quest changed', this.quest)
        // }
        // Deep Watch:
        quest: {
            handler(){
                console.log('Quest changed', this.quest)
            },
            deep: true
        }
    },
    methods: {
        animateTitle() {
            utilService.animateCSS(this.$refs.myTitle, 'tada')
        }
    }
}