export default {
    props: ['car'],
    template: `
        <article class="car-preview">
            <h2>{{ car.vendor }}</h2>
            <h3>{{ car.speed }} KMH</h3>
            <h4>
                <RouterLink :to="'/user/' + car.owner?._id">
                    Owner: {{ car.owner?.fullname }}
                </RouterLink>
            </h4>
        </article>
    `,
}