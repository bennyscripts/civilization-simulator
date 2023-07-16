const capitalizeStr = (string) => string.charAt(0).toUpperCase() + string.slice(1)
const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min)
const randomName = () => capitalizeStr(names[Math.floor(Math.random() * names.length)])
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
const yearGoals = [
    100,
    500,
    1000,
    5000,
    10000,
    50000,
    100000,
    500000,
    1000000,
    50000000,
    100000000
]

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
let gameSpeedInput   = document.getElementById("game-speed-input")
let birthChanceInput = document.getElementById("birth-chance-input")
let deadlyVirusInput = document.getElementById("deadly-virus-input")
let playPauseButton  = document.getElementById("play-pause-btn")

let yearsPassedInput       = document.getElementById('years-passed-input')
let currentPopulationInput = document.getElementById('current-population-input')
let currentDeathsInput     = document.getElementById('current-deaths-input')
let currentChildrenInput   = document.getElementById('current-children-input')
let currentTeenagersInput  = document.getElementById('current-teenagers-input')
let currentAdultsInput     = document.getElementById('current-adults-input')
let currentAverageAgeInput = document.getElementById('current-average-age-input')

let updatesInput = document.getElementById('updates-input')
let updatesList  = document.getElementById('updates-list')
let theEndCard   = document.getElementById('the-end-card')

let covid19Btn   = document.getElementById("covid-19-btn")
let startOverBtn = document.getElementById("start-over-btn")
let worldWarBtn  = document.getElementById('world-war-btn')

// User has control
let speed   = 500 // cannot go below 500
let birthChance = 30 / 100 // percentage of children being born
let deadyVirus = true

// User doesnt have control
let people  = []
// let deaths  = []
let deaths  = 0
let years   = 0
let update  = ""
let running = false
let notifications = 0
let warHappening = false
let warYears = 0

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

        if (warHappening) {
            warYears += 1

            let amountToKill = randomInt(350, 500)
            let dead = people.slice(0, amountToKill)
            // deaths.push(...dead)
            deaths += dead.length
            people = dead

            notification(`☠️ ${amountToKill.toLocaleString()} people were just killed during the war!`)
            toastNotification(`☠️ ${amountToKill.toLocaleString()} people were just killed during the war!`)

            if (warYears >= randomInt(3, 4)) worldWar()
        }

        if (yearGoals.includes(years)) {
            toastNotification(`🎉 You've just reached ${years.toLocaleString()} years!`)
        }

        if (deadyVirus) {
            if (years % 150 == 0) {
                let amountToKill = Math.floor(people.length / 1.9) - 1
                let dead = people.slice(0, amountToKill)
                // deaths.push(...dead)
                deaths += dead.length
                people = dead

                notification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
                toastNotification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
            } else if (years % 500 == 0) {
                let amountToKill = Math.floor(people.length / 1.5) - 1
                let dead = people.slice(0, amountToKill)
                // deaths.push(...dead)
                deaths += dead.length
                people = dead

                notification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
                toastNotification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
            } else if (years % 1000 == 0) {
                let amountToKill = Math.floor(people.length / 1.25) - 1
                let dead = people.slice(0, amountToKill)
                // deaths.push(...dead)
                deaths += dead.length
                people = dead

                notification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
                toastNotification(`☠️ A deadly virus just killed ${amountToKill.toLocaleString()}!`)
            }
        }
    }

    setTimeout(updateYears, speed)
}

const toastNotification = text => {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#2d2d2d",
          boxShadow: "none"
        }
    }).showToast();
}

const notification = text => {
    notifications += 1
    let listItem = document.createElement("li")
    listItem.classList = "list-group-item"
    listItem.innerText = text

    updatesList.insertBefore(listItem, updatesList.firstChild)
}

const covid19 = () => {
    let amountToKill = Math.floor(people.length / 2) - 1
    let dead = people.slice(0, amountToKill)
    // deaths.push(...dead)
    deaths += dead.length
    people = dead

    notification(`🤢 Covid 19 just hit, Killing ${amountToKill} people!`)
}

const worldWar = () => {
    warYears = 0

    if (worldWarBtn.innerText.toLocaleLowerCase().includes("stop")) {
        worldWarBtn.innerText = "Start a war"
        worldWarBtn.classList = "btn btn-outline-danger w-100 py-3"
        warHappening = false
    } else {
        worldWarBtn.innerText = "Stop war"
        worldWarBtn.classList = "btn btn-danger w-100 py-3"
        warHappening = true
    }
}

const getAgeType = () => {
    let teens    = []
    let children = []
    let adults   = []

    for (index in people) {
        guy = people[index]
        if (guy.age >= 13 && guy.age <= 18) {
            teens.push(guy)
        } else if (guy.age < 13) {
            children.push(guy)
        } else {
            adults.push(guy)
        }
    }

    return [children, teens, adults]
}

const getAverageAge = () => {
    let agesList = []
    for (index in people) agesList.push(people[index].age)

    return Math.floor(average(agesList))
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

        if (notifications >= 15) {
            while (updatesList.childNodes.length > 10) {
                updatesList.removeChild(updatesList.lastChild);
            }
        }

        let newPeople = 0;
        let passedAway = 0;

        for (index in people) {
            guy = people[index]
            
            if (guy != undefined) {
                if (guy.age >= randomInt(65, 85)) {
                    people = people.filter(x => x.name != guy.name)
                    // deaths.push(guy)
                    deaths += 1
                    passedAway += 1;
                } else if (guy.age > randomInt(20, 28) && guy.age < randomInt(40, 50)) {
                    if (Math.random() < birthChance) {
                        newGuy = new Person(randomName(), 0, 0, 0)
                        people.push(newGuy)
                        newPeople += 1
                    }
                }
            }
        }

        if (passedAway > 0) notification(`☠️ ${passedAway} people passed away today`)
        if (newPeople > 0) notification(`💞 ${newPeople} people have just been born!`)

        // console.clear()
        // console.log(`Years passed: ${years}`)
        // console.log(`Current population: ${people.length}`)
        // console.log(`Current deaths: ${deaths.length}`)
        // console.log(update)

        yearsPassedInput.value       = years.toLocaleString()
        currentPopulationInput.value = people.length.toLocaleString()
        // currentDeathsInput.value  = deaths.length.toLocaleString()
        currentDeathsInput.value     = deaths.toLocaleString()

        let diffAgeStuff             = getAgeType()
        currentChildrenInput.value   = diffAgeStuff[0].length.toLocaleString()
        currentTeenagersInput.value  = diffAgeStuff[1].length.toLocaleString()
        currentAdultsInput.value     = diffAgeStuff[2].length.toLocaleString()
        currentAverageAgeInput.value = getAverageAge().toLocaleString()
    }

    setTimeout(simulation, speed/4)
}

const startSimulation = () => {
    if (gameSpeedInput.value < 0.1 || gameSpeedInput.value > 2) gameSpeedInput.value = 1
    if (birthChanceInput.value < 0 || birthChanceInput.value > 100) birthChanceInput = 10

    speed = parseInt(gameSpeedInput.value) * 1000
    birthChance = parseInt(birthChanceInput.value) / 100
    deadyVirus = deadlyVirusInput.checked
    running = true

    gameSpeedInput.disabled = true
    birthChanceInput.disabled = true
    deadlyVirusInput.disabled = true

    worldWarBtn.disabled = false
    covid19Btn.disabled = false
    startOverBtn.disabled = false

    playPauseButton.innerText = "Stop Civilization"
    playPauseButton.classList = "btn btn-danger w-100"
    playPauseButton.setAttribute('onclick', 'stopSimulation()')

    updateYears()
    simulation()
}

const stopSimulation = () => {
    running = false

    gameSpeedInput.disabled = false
    birthChanceInput.disabled = false
    deadlyVirusInput.disabled = false

    worldWarBtn.disabled = true
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
    deaths  = 0
    years   = 0
    update  = ""

    for (let i = 0; i < 5; i++) {
        people.push(new Person(randomName(), 0, 0, 0))
    }

    notification("😭 Simulation has been reset!")
}