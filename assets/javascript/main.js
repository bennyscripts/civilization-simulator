const capitalizeStr = (string) => string.charAt(0).toUpperCase() + string.slice(1)
const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min)
const randomName = () => capitalizeStr(names[Math.floor(Math.random() * names.length)])

class Person {
    constructor(name, age, x, y) {
        this.name = name
        this.age = age
        this.position = {x, y}
    }

    move(new_x, new_y) {
        this.position = {new_x, new_y}
    }

    grow() {
        this.age += 1
    }
}

// HTML Elements
let gameSpeedInput         = document.getElementById("game-speed-input")
let birthChanceInput       = document.getElementById("birth-chance-input")
let playPauseButton        = document.getElementById("play-pause-btn")
let yearsPassedInput       = document.getElementById('years-passed-input')
let currentPopulationInput = document.getElementById('current-population-input')
let currentDeathsInput     = document.getElementById('current-deaths-input')
let updatesInput           = document.getElementById('updates-input')
let theEndCard             = document.getElementById('the-end-card')

let covid19Btn   = document.getElementById("covid-19-btn")
let startOverBtn = document.getElementById("start-over-btn")
let worldWarBtn  = document.getElementById('world-war-btn')

// User has control
let speed   = 500 // cannot go below 500
let birthChance = 30 / 100 // percentage of children being born

// User doesnt have control
let people  = []
// let deaths  = []
let deaths  = 0
let years   = 0
let update  = ""
let running = false

// Start off with 5 people
for (let i = 0; i < 5; i++) {
    people.push(new Person(randomName(), 0, 0, 0))
}

async function updateYears() {
    if (running) {
        years += 1

        for (index in people) {
            guy = people[index]
            
            if (guy != undefined) {
                guy.grow()
            }
        }

        if (years % 150 == 0) {
            let amountToKill = Math.floor(people.length / 1.5) - 1
            let dead = people.slice(0, amountToKill)
            // deaths.push(...dead)
            deaths += dead.length
            people = dead

            update = `A deadly virus just killed ${amountToKill}!`
        }
    }

    setTimeout(updateYears, speed)
}

async function clearUpdate() {
    if (running) {
        update = ""
    }

    setTimeout(clearUpdate, 2000)
}

const covid19 = () => {
    let amountToKill = Math.floor(people.length / 2) - 1
    let dead = people.slice(0, amountToKill)
    // deaths.push(...dead)
    deaths += dead.length
    people = dead

    update = `Covid 19 just hit! Killing ${amountToKill} people!`
}

const worldWar = () => {
    if (worldWarBtn.innerText.toLocaleLowerCase().includes("stop")) {
        worldWarBtn.innerText = "Start a war"
        worldWarBtn.classList = "btn btn-outline-danger w-100 py-3"
    } else {
        worldWarBtn.innerText = "Stop war"
        worldWarBtn.classList = "btn btn-danger w-100 py-3"
    }
}

async function simulation() {
    if (running) {
        // if (speed < 100) {
        //     speed = 500
        // }

        if (people.length <= 0) {
            if (!theEndCard.classList.contains("show")) {
                theEndCard.classList.remove("hide")
                theEndCard.classList.add("show")
                stopSimulation();
            }
        }

        for (index in people) {
            guy = people[index]
            
            if (guy != undefined) {
                if (guy.age >= randomInt(65, 85)) {
                    people = people.filter(x => x.name != guy.name)
                    // deaths.push(guy)
                    deaths += 1
                    // update = `${guy.name} has sadly passed away at ${guy.age}`
                } else if (guy.age > randomInt(20, 28) && guy.age < randomInt(40, 50)) {
                    if (Math.random() < birthChance) {
                        newGuy = new Person(randomName(), 0, 0, 0)
                        people.push(newGuy)
                        // update = `${newGuy.name} has been born!`
                    }
                }
            }
        }

        // console.clear()
        // console.log(`Years passed: ${years}`)
        // console.log(`Current population: ${people.length}`)
        // console.log(`Current deaths: ${deaths.length}`)
        // console.log(update)

        yearsPassedInput.value = years.toLocaleString()
        currentPopulationInput.value = people.length.toLocaleString()
        // currentDeathsInput.value = deaths.length.toLocaleString()
        currentDeathsInput.value = deaths.toLocaleString()
        updatesInput.value = update
    }

    setTimeout(simulation, speed/4)
}

const startSimulation = () => {
    if (gameSpeedInput.value < 0.1 || gameSpeedInput.value > 2) gameSpeedInput.value = 1
    if (birthChanceInput.value < 0 || birthChanceInput.value > 100) birthChanceInput = 10

    speed = parseInt(gameSpeedInput.value) * 1000
    birthChance = parseInt(birthChanceInput.value) / 100
    running = true

    gameSpeedInput.disabled = true
    birthChanceInput.disabled = true

    // worldWarBtn.disabled = false
    covid19Btn.disabled = false
    startOverBtn.disabled = false

    playPauseButton.innerText = "Stop Civilization"
    playPauseButton.classList = "btn btn-danger w-100"
    playPauseButton.setAttribute('onclick', 'stopSimulation()')

    updateYears()
    clearUpdate()
    simulation()
}

const stopSimulation = () => {
    running = false

    gameSpeedInput.disabled = false
    birthChanceInput.disabled = false

    // worldWarBtn.disabled = true
    covid19Btn.disabled = true
    startOverBtn.disabled = true

    if (theEndCard.classList.contains("show")) {
        playPauseButton.innerText = "Restart Civilization"
        playPauseButton.classList = "btn btn-danger w-100"
        playPauseButton.setAttribute('onclick', 'resetSimulation()')
    } else {
        playPauseButton.innerText = "Start Civilization"
        playPauseButton.classList = "btn btn-success w-100"
        playPauseButton.setAttribute('onclick', 'startSimulation()')
    }
}

const resetSimulation = () => {
    if (theEndCard.classList.contains("show")) {
        theEndCard.classList.add("hide")
        theEndCard.classList.remove("show")
        startSimulation();
    }

    people  = []
    deaths  = []
    years   = 0
    update  = ""

    for (let i = 0; i < 5; i++) {
        people.push(new Person(randomName(), 0, 0, 0))
    }
}