const forms = [
    {
        "name": "3-1 Stairs",
        "img": "31stairs.png",
        "cursed": false
    },
    {
        "name": "2-2 Stairs",
        "img": "22stairs.png",
        "cursed": false
    },
    {
        "name": "1-3 Stairs",
        "img": "13stairs.png",
        "cursed": true
    },
    {
        "name": "Stairs (any)",
        "img": "anystairs.png",
        "cursed": false
    },
    {
        "name": "2-1-1 Sandwich",
        "img": "211sandwich.png",
        "cursed": false
    },
    {
        "name": "1-2-1 Sandwich",
        "img": "121sandwich.png",
        "cursed": true
    },
    {
        "name": "1-1-2 Sandwich",
        "img": "112sandwich.png",
        "cursed": false
    },
    {
        "name": "3-0-1/1-0-3 Sandwich",
        "img": "mixedsandwich.png",
        "cursed": false,
    },
    {
        "name": "Sandwich (any)",
        "img": "mixedsandwich.png",
        "cursed": false
    },
    {
        "name": "GTR",
        "img": "gtr.png",
        "cursed": false
    },
    {
        "name": "New GTR",
        "img": "newgtr.png",
        "cursed": false
    },
    {
        "name": "L-Shape",
        "img": "lshape.png",
        "cursed": false
    },
    {
        "name": "Harpy Stacking",
        "img": "harpystacking.png",
        "cursed": true
    },
    {
        "name": "Frog Stacking",
        "img": "frogstacking.png",
        "cursed": true
    },
]

const preloadedImages = []

function preloadImage(url) {
    preloadedImages.push((new Image()).src = url)
}

function createChainingFormChecks() {
    let container = document.getElementById("formsContainer")

    for (let i= 0; i < forms.length; i++) {
        const e = forms[i]
        
        let s = `
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="chainform" id="chainform${i}" value="${i}" checked>
            <label class="form-check-label text-light" for="chainform${i}">${e.name}</label>
        </div>
        `

        container.innerHTML += s

        preloadImage("imgs/" + e.img)
    }
}

function selectNone() {
    document.getElementsByName("chainform").forEach(element => {
        element.checked = false
    });
}

function selectAll() {
    document.getElementsByName("chainform").forEach(element => {
        element.checked = true
    })
}

function selectNoCursed()  {
    let checks = document.getElementsByName("chainform")

    for (i = 0; i < forms.length; i++) {
        const e = forms[i]

        if (e.cursed) {
            checks[i].checked = false
        } else {
            checks[i].checked = true
        }        
    }
}

function selectOnlyCursed()  {
    let checks = document.getElementsByName("chainform")

    for (i = 0; i < forms.length; i++) {
        const e = forms[i]

        if (e.cursed) {
            checks[i].checked = true
        } else {
            checks[i].checked = false
        }        
    }
}

function showCard() {
    let players
    let playerForms = document.getElementsByName("player")
    let chainForms = document.getElementsByName("chainform")
    let placeholder = document.getElementById("results")
    let pool = []

    placeholder.innerHTML = ""

    for (let i = 0; i < playerForms.length; i++) {
        let e = playerForms[i]

        if (e.checked) {
            players = e.value
            break
        }
    }

    for (let i = 0; i < chainForms.length; i++) {
        let e = chainForms[i]

        if (e.checked) {
            pool.push(i)
        }
    }

    if (pool.length == 0) {
        alert("Please select some chaining forms first.")
        return
    }

    for (let i = 0; i < players; i++) {
        let pickIndex = Math.floor(Math.random() * pool.length)
        let pick = forms[pool[pickIndex]]

        let s = `
        <div class="col">
            <div class="card mx-auto text-center" style="width: 256px">
                <img src="imgs/${pick.img}" class="card-img-top p-3" alt="" style="max-width: 256px;">
                <div class="card-body">
                    <h5 class="card-title">${pick.name}</h5>
                    <span class="card-body">Player ${i+1}</span>
                </div>
            </div>
        </div>

        <div class="w-100 d-none d-xs-block"></div>
        `

        placeholder.innerHTML += s
    }
}

window.onload = function() {
    createChainingFormChecks()
}