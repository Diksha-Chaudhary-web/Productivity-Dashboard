function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })
}

openFeatures()


function todoList() {

    var currentTask = []

    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    }

    function renderTask() {

        var allTask = document.querySelector('.allTask')

        var sum = ''

        currentTask.forEach(function (elem, idx) {
            sum = sum + `<div class="task">
        <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
        <button id=${idx}>Mark as Completed</button>
        </div>`
        })

        allTask.innerHTML = sum

        localStorage.setItem('currentTask', JSON.stringify(currentTask))

        document.querySelectorAll('.task button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTask()
            })
        })
    }
    renderTask()

    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('.addTask form #task-input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        if (!taskInput.value.trim()) return

        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        )
        renderTask()

        taskCheckbox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })

}

todoList()


function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)

    function escapeAttribute(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id="${idx}" type="text" placeholder="..." value="${escapeAttribute(savedData)}">
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            dayPlanData[elem.id] = elem.value

            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}

dailyPlanner()


function motivationalQuote() {
    var motivationQuoteContent = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        try {
            let response = await fetch('https://api.quotable.io/random')
            let data = await response.json()

            motivationQuoteContent.textContent = data.content
            motivationAuthor.textContent = data.author
        } catch (error) {
            motivationQuoteContent.textContent = 'Stay consistent. Progress compounds over time.'
            motivationAuthor.textContent = 'Unknown'
        }
    }

    fetchQuote()
}

motivationalQuote()


function pomodoroTimer() {


    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector('.pomo-timer .start-timer')
    var pauseBtn = document.querySelector('.pomo-timer .pause-timer')
    var resetBtn = document.querySelector('.pomo-timer .reset-timer')
    var session = document.querySelector('.pomodoro-fullpage .session')
    var isWorkSession = true

    let totalSeconds = 25 * 60
    let timerInterval = null

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        timer.textContent = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
    }

    function startTimer() {
        if (timerInterval) return

        timerInterval = setInterval(function () {
            if (totalSeconds > 0) {
                totalSeconds--
                updateTimer()
                return
            }

            clearInterval(timerInterval)
            timerInterval = null

            if (isWorkSession) {
                isWorkSession = false
                session.textContent = 'Take a Break'
                session.style.backgroundColor = 'var(--blue)'
                totalSeconds = 5 * 60
            } else {
                isWorkSession = true
                session.textContent = 'Work Session'
                session.style.backgroundColor = 'var(--green)'
                totalSeconds = 25 * 60
            }

            updateTimer()
        }, 1000)
    }

    function pauseTimer() {
        clearInterval(timerInterval)
        timerInterval = null
    }

    function resetTimer() {
        isWorkSession = true
        session.textContent = 'Work Session'
        session.style.backgroundColor = 'var(--green)'
        totalSeconds = 25 * 60
        clearInterval(timerInterval)
        timerInterval = null
        updateTimer()

    }

    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)

}

pomodoroTimer()



function weatherFunctionality() {


    var apiKey = 'f6b0cc1cc8fe42f7bc1192701260803'
    var city = 'Faridabad'



    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2Condition = document.querySelector('.header2 h4')
    var precipitation = document.querySelector('.header2 .precipitation')
    var humidity = document.querySelector('.header2 .humidity')
    var wind = document.querySelector('.header2 .wind')

    async function weatherAPICall() {
        try {
            var response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
            var data = await response.json()

            if (!data || !data.current) throw new Error('Invalid weather response')

            header2Temp.textContent = `${data.current.temp_c}°C`
            header2Condition.textContent = `${data.current.condition.text}`
            wind.textContent = `Wind: ${data.current.wind_kph} km/h`
            humidity.textContent = `Humidity: ${data.current.humidity}%`
            precipitation.textContent = `Heat Index: ${data.current.heatindex_c}°C`
        } catch (error) {
            header2Temp.textContent = '--°C'
            header2Condition.textContent = 'Weather unavailable'
            wind.textContent = 'Wind: --'
            humidity.textContent = 'Humidity: --'
            precipitation.textContent = 'Heat Index: --'
        }
    }

    weatherAPICall()


    function timeDate() {
        const totalDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        var date = new Date()
        var dayOfWeek = totalDaysOfWeek[date.getDay()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = monthNames[date.getMonth()]
        var year = date.getFullYear()

        header1Date.textContent = `${tarik} ${month}, ${year}`

        if (hours > 12) {
            header1Time.textContent = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`

        } else {
            header1Time.textContent = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`
        }
    }

    timeDate()
    setInterval(() => {
        timeDate()
    }, 1000)

}

weatherFunctionality()


function changeTheme() {

    var theme = document.querySelector('.theme')
    var rootElement = document.documentElement

    var flag = 0
    theme.addEventListener('click', function () {

        if (flag == 0) {
            rootElement.style.setProperty('--pri', '#F1F3E0')
            rootElement.style.setProperty('--sec', '#D2DCB6')
            rootElement.style.setProperty('--tri1', '#A1BC98')
            rootElement.style.setProperty('--tri2', '#778873')
            flag = 1
        } else if (flag == 1) {
            rootElement.style.setProperty('--pri', '#F1EFEC')
            rootElement.style.setProperty('--sec', '#030303')
            rootElement.style.setProperty('--tri1', '#D4C9BE')
            rootElement.style.setProperty('--tri2', '#123458')
            flag = 2
        } else if (flag == 2) {
            rootElement.style.setProperty('--pri', '#F3F4F4')
            rootElement.style.setProperty('--sec', '#853953')
            rootElement.style.setProperty('--tri1', '#612D53')
            rootElement.style.setProperty('--tri2', '#2C2C2C')
            flag = 0
        }

    })


}

changeTheme()
