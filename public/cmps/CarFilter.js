export default {
    template: `
        <section class="car-filter">
            <input 
                v-model="filterBy.vendor"
                placeholder="Search"
                type="text" />
                
            <input 
                v-model.number="filterBy.maxSpeed"
                placeholder="Max speed"
                type="number" />
        </section>
    `,
    data() {
        return {
            filterBy: { vendor: '', maxSpeed: 0, page: 0 },
        }
    },
    methods: {
        filter() {
            this.$emit('filter', this.filterBy)
        }
    },
    watch: {
        // filterBy: {
        //     handler() {
        //         console.log('filterBy changed', this.filterBy)
        //         this.$emit('filter', this.filterBy)
        //     },
        //     deep: true
        // },
        'filterBy.vendor'() {
            console.log('filterBy VENDOR changed', this.filterBy)
            this.$emit('filter', this.filterBy)
        },
    }

}