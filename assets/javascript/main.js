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

const width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

const height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

// HTML Elements
let gameSpeedInput   = document.getElementById("game-speed-input")
let birthChanceInput = document.getElementById("birth-chance-input")
let deadlyVirusInput = document.getElementById("deadly-virus-input")
let playPauseButton  = document.getElementById("play-pause-btn")

let playPauseButtonMobile = document.getElementById("play-pause-btn-mobile")
let resetButtonMobile     = document.getElementById("reset-btn-mobile")
let settingsButtonMobile  = document.getElementById("settings-btn-mobile")
let theEndCardMobile      = document.getElementById('the-end-card-mobile')
let fullscrenOpacity      = document.getElementsByClassName('fullsize-opacity')[0]

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

let covid19Btn   = document.getElementsByClassName("covid-19-btn")
let startOverBtn = document.getElementById("start-over-btn")
let worldWarBtn  = document.getElementById('world-war-btn')

let settingsCard = document.getElementsByClassName('settings-card')[0]
let statsCard    = document.getElementsByClassName('stats-card')[0]
let utilsCard    = document.getElementsByClassName('utils-card')[0]
let utilities    = document.getElementsByClassName('utilities')[0]

let settingsCardBody   = settingsCard.getElementsByClassName("card-body")[0]
let settingsCardFooter = settingsCard.getElementsByClassName("card-footer")[0]
let utilsCardHeader    = utilsCard.getElementsByClassName("card-header")[0]
let statsCardHeader    = statsCard.getElementsByClassName("card-header")[0]

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
let bornLastXYears = 0
let diedLastXYears = 0

// Start off with 5 people
for (let i = 0; i < 5; i++) {
    people.push(new Person(randomName(), 0, 0, 0))
}

async function updateYears() {
    if (running && people.length > 0) {
        years += 1

        if (years % 50 == 0) {
            // if (diedLastXYears > 0) notification(`☠️ Year ${years}: ${diedLastXYears} people dead`)
            // if (bornLastXYears > 0) notification(`💞 Year ${years}: ${bornLastXYears} people born`)

            bornLastXYears = 0
            diedLastXYears = 0
        }

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
            notification(`🎉 You've just reached ${years.toLocaleString()} years!`)
            toastNotification(`🎉 You've just reached ${years.toLocaleString()} years!`)
        }

        if (deadyVirus) {
            if (years % 1000 == 0) {
                let amountToKill = Math.floor(people.length / 1.95) - 1
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
    if (width > 768) {
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
}

const notification = text => {
    notifications += 1
    let listItem = document.createElement("li")
    listItem.classList = "list-group-item"
    listItem.innerText = text

    updatesList.insertBefore(listItem, updatesList.firstChild)
}

const covid19 = () => {
    let elderly = people.filter(x => x.age >= 60)
    people = people.filter(x => x.age <= 60)
    deaths += elderly.length

    console.log(elderly)

    notification(`🤢 Covid 19 just killed ${elderly.length.toLocaleString()} people!`)
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

const endCard = (show) => {
    if (show) {
        if (width > 768) {
            if (!theEndCard.classList.contains("show")) {
                theEndCard.classList.remove("hide")
                theEndCard.classList.add("show")
            }
        } else {
            if (!theEndCardMobile.classList.contains("show")) {
                theEndCardMobile.classList.remove("hide")
                theEndCardMobile.classList.add("show")
                fullscrenOpacity.classList.remove("hide")
                fullscrenOpacity.classList.add("show")
            }
        }
    } else {
        if (width > 768) {
            if (!theEndCard.classList.contains("hide")) {
                theEndCard.classList.remove("show")
                theEndCard.classList.add("hide")
            }
        } else {
            if (!theEndCardMobile.classList.contains("hide")) {
                theEndCardMobile.classList.remove("show")
                theEndCardMobile.classList.add("hide")
                fullscrenOpacity.classList.remove("show")
                fullscrenOpacity.classList.add("hide")
            }
        }        
    }
}

async function simulation() {
    if (running && people.length > 0) {
        // if (speed < 100) {
        //     speed = 500
        // }

        if (notifications >= 15) {
            while (updatesList.childNodes.length > 10) {
                updatesList.removeChild(updatesList.lastChild);
            }
        }

        for (index in people) {
            guy = people[index]
            
            if (guy != undefined) {
                if (guy.age >= randomInt(80, 95)) {
                    people = people.filter(x => x.name != guy.name)
                    // deaths.push(guy)
                    deaths += 1
                    diedLastXYears += 1;
                } else if (guy.age > randomInt(20, 28) && guy.age < randomInt(40, 50)) {
                    if (Math.random() < birthChance) {
                        newGuy = new Person(randomName(), 0, 0, 0)
                        people.push(newGuy)
                        bornLastXYears += 1
                    }
                }
            }
        }

        // console.clear()
        // console.log(`Years passed: ${years}`)
        // console.log(`Current population: ${people.length}`)
        // console.log(`Current deaths: ${deaths.length}`)
        // console.log(update)

        yearsPassedInput.value       = years.toLocaleString()
        currentPopulationInput.innerText = people.length.toLocaleString()
        // currentDeathsInput.innerText  = deaths.length.toLocaleString()
        currentDeathsInput.innerText     = deaths.toLocaleString()

        let diffAgeStuff             = getAgeType()
        currentChildrenInput.innerText   = diffAgeStuff[0].length.toLocaleString()
        currentTeenagersInput.innerText  = diffAgeStuff[1].length.toLocaleString()
        currentAdultsInput.innerText     = diffAgeStuff[2].length.toLocaleString()
        currentAverageAgeInput.innerText = getAverageAge().toLocaleString()
    } else if (people.length <= 0) {
        endCard(true)
        stopSimulation()
        resetSimulation()
        setTimeout(() => {endCard(false)}, 3000)
    }

    setTimeout(simulation, speed/4)
}

const mobileUi = (running) => {
    if (width <= 768) {
        settingsCardBody.classList.remove("hide")
        settingsCardFooter.classList.remove("hide")
        utilsCardHeader.classList.remove("hide")
        statsCardHeader.classList.remove("hide")
        utilities.classList.remove("hide")
        statsCard.classList.remove("hide")
        utilsCard.classList.remove("hide")
        settingsCardBody.classList.remove("show")
        settingsCardFooter.classList.remove("show")
        utilsCardHeader.classList.remove("show")
        statsCardHeader.classList.remove("show")
        utilities.classList.remove("show")
        statsCard.classList.remove("show")
        utilsCard.classList.remove("show")
    
        if (!running) {
            if (settingsCardBody.classList.contains("hide") || !settingsCardBody.classList.contains("show")) settingsCardBody.classList.add("show")
            if (settingsCardFooter.classList.contains("hide") || !settingsCardFooter.classList.contains("show")) settingsCardFooter.classList.add("show")
            if (utilsCardHeader.classList.contains("hide") || !utilsCardHeader.classList.contains("show")) utilsCardHeader.classList.add("show")
            if (statsCardHeader.classList.contains("hide") || !statsCardHeader.classList.contains("show")) statsCardHeader.classList.add("show")
            if (utilities.classList.contains("hide") || !utilities.classList.contains("show")) utilities.classList.add("show")
        
            if (statsCard.classList.contains("show") || !statsCard.classList.contains("hide")) statsCard.classList.add("hide")
            if (utilsCard.classList.contains("show") || !utilsCard.classList.contains("hide")) utilsCard.classList.add("hide")
        } else {
            if (settingsCardBody.classList.contains("show") || !settingsCardBody.classList.contains("hide")) settingsCardBody.classList.add("hide")
            if (settingsCardFooter.classList.contains("show") || !settingsCardFooter.classList.contains("hide")) settingsCardFooter.classList.add("hide")
            if (utilsCardHeader.classList.contains("show") || !utilsCardHeader.classList.contains("hide")) utilsCardHeader.classList.add("hide")
            if (statsCardHeader.classList.contains("show") || !statsCardHeader.classList.contains("hide")) statsCardHeader.classList.add("hide")
            if (utilities.classList.contains("show") || !utilities.classList.contains("hide")) utilities.classList.add("hide")
        
            if (statsCard.classList.contains("hide") || !statsCard.classList.contains("show")) statsCard.classList.add("show")
            if (utilsCard.classList.contains("hide") || !utilsCard.classList.contains("show")) utilsCard.classList.add("show")
        }
    }
}

const pauseSimulation = () => {
    running = false
    playPauseButtonMobile.classList = "fa-solid fa-play fa-xl"
    playPauseButtonMobile.setAttribute("onclick", "startSimulation()")

    worldWarBtn.disabled = true
    covid19Btn[0].disabled = true
    covid19Btn[1].disabled = true
    startOverBtn.disabled = true
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
    covid19Btn[0].disabled = false
    covid19Btn[1].disabled = false
    startOverBtn.disabled = false

    playPauseButton.innerText = "Stop Civilization"
    playPauseButton.classList = "btn btn-danger w-100"
    playPauseButtonMobile.classList = "fa-solid fa-pause fa-xl"
    playPauseButton.setAttribute('onclick', 'stopSimulation()')
    playPauseButtonMobile.setAttribute("onclick", "pauseSimulation()")
    settingsButtonMobile.setAttribute("onclick", "stopSimulation()")

    mobileUi(running)
    updateYears()
    simulation()
}

const stopSimulation = () => {
    running = false

    gameSpeedInput.disabled = false
    birthChanceInput.disabled = false
    deadlyVirusInput.disabled = false

    worldWarBtn.disabled = true
    covid19Btn[0].disabled = true
    covid19Btn[1].disabled = true
    startOverBtn.disabled = true

    mobileUi(running)

    if (theEndCard.classList.contains("show")) {
        playPauseButton.innerText = "Restart Civilization"
        playPauseButton.classList = "btn btn-danger w-100"
        playPauseButton.setAttribute('onclick', 'resetSimulation()')
    } else {
        playPauseButton.innerText = "Start Civilization"
        playPauseButton.classList = "btn btn-success w-100"
        playPauseButtonMobile.classList = "fa-solid fa-play fa-xl"
        playPauseButton.setAttribute('onclick', 'startSimulation()')
        playPauseButtonMobile.setAttribute("onclick", "startSimulation()")
        settingsButtonMobile.setAttribute("onclick", "startSimulation()")
    }
}

const resetSimulation = () => {
    // if (theEndCard.classList.contains("show")) {
    //     theEndCard.classList.add("hide")
    //     theEndCard.classList.remove("show")
    //     startSimulation();
    // }

    people  = []
    deaths  = 0
    years   = 0
    update  = ""

    for (let i = 0; i < 5; i++) {
        people.push(new Person(randomName(), 0, 0, 0))
    }

    notification("😭 Simulation has been reset!")
}

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        if (running) {
            stopSimulation()
        } else {
            startSimulation()
        }
    }
}

mobileUi(running)
playPauseButtonMobile.setAttribute("onclick", "startSimulation()")