// Image Preloading
const preloadedImages = []

function preloadImage(url) {
    preloadedImages.push((new Image()).src = url)
}

let players
let pool
let chainChecks
let syncURLResultElement
let seed

function randomizeAndGenerateSyncURL() {
    seed = Math.random().toString().substr(2, 8);
    random = new RNG(seed)

    let poolString = ""

    for (let num = 0; num < Math.floor(chainChecks.length/33) + 1; num++) {
        let poolNum = 0
        const start = num*32

        for (let shift = 0; shift < Math.min(chainChecks.length - start, 32); shift++) {
            poolNum += Number(chainChecks[start + shift].checked) << shift
        }

        poolString += ";" + poolNum
    }

    syncURLResultElement.value = `${window.location.href.split("?")[0]}?sync=${players}${poolString};${seed}`
}

function readSyncURL() {
    let usp = new URLSearchParams(window.location.search)
    let param = usp.get("sync")

    if (param === null) {
        return false
    }

    let parts = param.split(";")

    if (parts.length < 3) {
        return false
    }

    pool = []

    for (let i = 0; i < parts.length; i++) {
        const e = parts[i]

        // Read player number
        if (i == 0) {
            document.getElementById(e + "p").checked = true
            players = Number(e)
            continue
        }

        // Read seed
        if (i == parts.length - 1) {
            seed = Number(e)
            continue
        }

        // Read Chaining Form checkboxes
        const num = i-1
        const poolNum = Number(e)

        for (let shift = 0; shift < Math.min(chainChecks.length - num*32, 32); shift++) {
            const index = num*32 + shift
            const test = poolNum & (1 << shift)

            if (test > 0) {
                pool.push(index)
                chainChecks[index].checked = true
            } else {
                chainChecks[index].checked = false
            }
        }
    }

    random = new RNG(seed)

    return true
}

function selectNone() {
    chainChecks.forEach(element => {
        element.checked = false
    });

    randomizeAndGenerateSyncURL()
}

function selectAll() {
    chainChecks.forEach(element => {
        element.checked = true
    })

    randomizeAndGenerateSyncURL()
}

function selectNoCursed()  {
    for (i = 0; i < forms.length; i++) {
        const e = forms[i]

        if (e.cursed) {
            chainChecks[i].checked = false
        } else {
            chainChecks[i].checked = true
        }        
    }

    randomizeAndGenerateSyncURL()
}

function selectOnlyCursed()  {
    for (i = 0; i < forms.length; i++) {
        const e = forms[i]

        if (e.cursed) {
            chainChecks[i].checked = true
        } else {
            chainChecks[i].checked = false
        }        
    }

    randomizeAndGenerateSyncURL()
}

function showCard() {
    let placeholder = document.getElementById("results")
    placeholder.innerHTML = ""

    if (pool.length == 0) {
        alert("Please select some chaining forms first.")
        return
    }

    for (let i = 0; i < players; i++) {
        let pickIndex = Math.floor(random.random(0, pool.length))
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
    let container = document.getElementById("formsContainer")

    for (let i= 0; i < forms.length; i++) {
        const e = forms[i]
        
        let s = `
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="chainform" id="chainform${i}" value="${i}" onchange="regeneratePool();generateSyncURL()" checked>
            <label class="form-check-label text-light" for="chainform${i}">${e.name}</label>
        </div>
        `

        container.innerHTML += s

        preloadImage("imgs/" + e.img)
    }
    
    document.getElementsByName("player").forEach(element => {
        if (element.checked) {
            players = Number(element.value)
            return
        }
    });

    chainChecks = Array.from(document.getElementsByName("chainform"))
    syncURLResultElement = document.getElementById("syncURLResults")

    // Read Sync URL
    let success = readSyncURL()

    if (!success) {
        pool = []

        for (let i = 0; i < chainChecks.length; i++) {
            if (chainChecks[i].checked) {
                pool.push(i)
            }
        }

        randomizeAndGenerateSyncURL()
    }

    
}