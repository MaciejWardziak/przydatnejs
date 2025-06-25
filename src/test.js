import { adult } from "./adult";


class Person {
    constructor(name, year, adult){
        this.name = name;
        this.year = year;
        this.adult = adult;
    }

    sayHi(){
        return `Hello ${this.name}`;
    }
}
let person = null;
let myChart = null;

document.getElementById("person-form").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name-input").value;
    let year = parseInt(document.getElementById("year-input").value);

    person = new Person(name, year);

    const output = document.getElementById("output");
    output.innerHTML = person.sayHi();

    const status = adult(year);

    if (status === "adult") {
        person.adult = "adult";
        output.innerHTML += "<br>Jesteś pełnoletni. Zapraszamy.";
        updateStats(person);
        document.getElementById("more-info").style.display = "none";
        showChart();
        showMap();
    } else if (status === "not-adult") {
        person.adult = "not-adult";
        output.innerHTML += "<br>Nie jesteś pełnoletni. Nie możesz przejść dalej.";
        updateStats(person);
        CreateExitBtn();
        document.getElementById("more-info").style.display = "none";
        showChart();
        hideMap();
    } else {
        person.adult = "not-certain";
        output.innerHTML += "<br>Nie mamy pewności czy jesteś pełnoletni, potrzebujemy więcej danych.";
        document.getElementById("more-info").style.display = "block";
        hideMap();
    }
});



document.getElementById("birthday-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const birthday = parseInt(document.getElementById("day-input").value);
    const birthmonth = parseInt(document.getElementById("month-input").value);
    const output = document.getElementById("output2");

    if (birthmonth < month || (birthmonth === month && birthday <= day)) {
        person.adult = "adult";
        output.innerHTML = "Teraz już wiemy – jesteś pełnoletni. Zapraszam.";
        updateStats(person);
        document.getElementById("more-info").style.display = "block";
        showChart();
        showMap();
    } else {
        person.adult = "not-adult";
        output.innerHTML = "Teraz już wiemy – jeszcze nie jesteś pełnoletni. Dalej nie przejdziesz.";
        updateStats(person);
        CreateExitBtn();
        document.getElementById("more-info").style.display = "none";
        showChart();
        hideMap();
    }
});

function showMap() {
    document.getElementById("map").style.display = "block";

    const map = L.map("map").setView([59.4370, 24.7536], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Mapy © OpenStreetMap",
    }).addTo(map);

    L.marker([59.4370, 24.7536])
        .addTo(map)
        .bindPopup("Witaj na stronie pełnoletnich użytkowników!")
        .openPopup();

    Weather();
}
function hideMap() {
    document.getElementById("map").style.display = "none";
}

function CreateExitBtn(){
    const exitBtn = document.createElement("button");
        exitBtn.textContent = "Wyjdź";
        exitBtn.style.marginTop = "10px";
        exitBtn.style.backgroundColor = "crimson";
        exitBtn.style.color = "white";
        exitBtn.addEventListener("click", function () {window.location.href = "https://www.google.com";});
        output.appendChild(exitBtn);

}

function Weather(){
    const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
    const city = "Tallinn";

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`)
  .then(response => response.json())
  .then(data => {
    const temp = data.main.temp;
    const description = data.weather[0].description;

    const weatherBox = document.createElement("div");
    weatherBox.textContent = `Pogoda w ${city}: ${temp}°C, ${description}`;
    document.getElementById("output2").appendChild(weatherBox);
  })
  .catch(error => {
    console.error("Błąd podczas pobierania danych pogodowych:", error);
  });
}

function updateStats() {
    const stats = JSON.parse(localStorage.getItem("stats")) || {
        adult: 0,
        notAdult: 0
    };

    if (person.adult === "adult") {
        stats.adult++;
    } else if (person.adult === "not-adult") {
        stats.notAdult++;
    }

    localStorage.setItem("stats", JSON.stringify(stats));
}

function showChart() {
    const stats = JSON.parse(localStorage.getItem("stats")) || {
        adult: 0,
        notAdult: 0
    };

    const canvas = document.getElementById("myChart");
    canvas.style.display = "block"; 

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Pełnoletni", "Niepełnoletni"],
            datasets: [{
                label: "Liczba użytkowników",
                data: [stats.adult, stats.notAdult],
                backgroundColor: ["#4CAF50", "#F44336"],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}