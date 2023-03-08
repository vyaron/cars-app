
window.onGetCars = onGetCars

function onGetCars() {
    console.log('Getting yourt cars!')
    fetch('/api/car')
    .then(res => res.json())
    .then(cars => {
       const el = document.querySelector('pre')
       el.innerText = JSON.stringify(cars, null, 2)
       
    })
}
