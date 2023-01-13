let state;
let mostaniHonap = Number(new Date().getMonth());

function honapNevSzamitas(raw) {
    let rovHonapTomb = ['jan.', 'feb.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];
    return rovHonapTomb[raw]
}
function hosszuHonap(raw) {
    let hosszuTomb = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szept.', 'Október', 'November', 'December'];
    return hosszuTomb[raw];
}

window.onload=render;
function render() {    

    fetch('/munka')
    .then((response) => response.json())
    .then((response) => {
        state = response;
    
        //fejléc hónap
        document.getElementById('honapnev').innerHTML = hosszuHonap(mostaniHonap);

        document.getElementById('jobbnyil').onclick = () => {
            if(mostaniHonap!==11) {
                mostaniHonap++;
                render();
            }
        }

        document.getElementById('balnyil').onclick = () => {
            if(mostaniHonap!==0) {
                mostaniHonap--;
                render();
            }
        }

        //adatok beírása
        let workHTML = '';
        for(let stat of state) {
            if(stat.month===mostaniHonap+1) {
                workHTML += `
                <div class="egy" style="background:${stat.type === 'job' ? 'rgb(253, 255, 151)' : ''}">
                    <span class="datum">${honapNevSzamitas(stat.month-1)} ${stat.day}</span>
                    <span class="ora">${stat.hour} óra ledolgozott idő</span>
                    <span class="torles">
                        <i class="fa fa-trash" data-id=${stat._id}></i>
                    </span>
                </div>
                `;
            }
            
        }
        document.querySelector('.info').innerHTML = workHTML;
        
        for(let deleteBtn of document.querySelectorAll('.torles')) {

            deleteBtn.onclick = (event) => {
                let id = event.target.dataset.id;
            
                fetch(`/munka/${id}`, {
                    method: 'delete'
                })
                .then(response => response.json())
                .then((res) => {
                    console.log(res);
                })
                render();

            }
        }

        //órák és napok kiírása
        let kulNap = 0;
        let kulOra = 0;
        let jobNap = 0;
        let jobOra = 0;

        for(let i = 0; i < state.length; i++) {
            if(state[i].type==='job' && state[i].month===mostaniHonap+1) {
                jobNap++;
                jobOra+=state[i].hour;
            }
            if(state[i].type==='kul' && state[i].month===mostaniHonap+1) {
                kulNap++;
                kulOra+=state[i].hour;
            }
        }

        document.querySelector('.bejelentett').innerHTML = `<div></div>${kulNap} nap és ${kulOra} óra`;
        document.querySelector('.mini').innerHTML = `<div></div>${jobNap} nap és ${jobOra} óra`;



    })
 
    //felvétel űrlap megjelenítése
    document.querySelector('.new').onclick = () => {
        document.querySelector('.kilep').classList.add('megjelenit');
        document.querySelector('.ujfelvetel').classList.add('megjelenit');
    }
    //felvétel űrlap bezárása
    document.querySelector('.kilep').onclick = () => {
        document.querySelector('.kilep').classList.remove('megjelenit');
        document.querySelector('.ujfelvetel').classList.remove('megjelenit');
    }

    //új munkaidő felvétele
    document.querySelector('.ujfelvetel').onsubmit = (event) => {
        event.preventDefault();
        let month = Number(event.target.elements.datum.value[5] > 0 ? Number(`${event.target.elements.datum.value[5]}${event.target.elements.datum.value[6]}`) : event.target.elements.datum.value[6]);
        let day = Number(event.target.elements.datum.value[8]) === 0 ? Number(event.target.elements.datum.value[9]) : Number(`${event.target.elements.datum.value[8]}${event.target.elements.datum.value[9]}`);
        let hour = Number(event.target.elements.ora.value);
        let type = event.target.elements.type.value;

        let newWork = {
            month: month,
            day: day,
            hour: hour,
            type: type
        }

        fetch('/munka', {
            method: 'POST',
            body: JSON.stringify(newWork),
            headers: {
                'content-type': 'application/json'
            }
        })

        document.querySelector('.kilep').classList.remove('megjelenit');
        document.querySelector('.ujfelvetel').classList.remove('megjelenit');
        render();
 
    
        
    }

}