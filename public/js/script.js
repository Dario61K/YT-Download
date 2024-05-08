const url_form = document.getElementById('url-form') //formulario url, envia url al backend
const loader = document.getElementsByClassName('loader')[0] //animacion de url
const download_section = document.getElementsByClassName('download-section')[0] //para opacidad de la seccion
const video_name = document.getElementsByClassName('video-name')[0] //para obtener el nombre del archivo
const video_img = document.getElementsByClassName('img-miniatura')[0] //para obtner la miniatura del archivo
const select_ql = document.getElementsByClassName('options-quality')[0] //para obtner el valor del select y agregar nuevas options
const itag_form = document.getElementsByClassName('butons')[0] //formulario final, envia el itag al backend
const prepare = document.getElementsByClassName('prepare')[0] //muestra un aviso de que el archivo se esta descargando en el servidor
const done = document.getElementsByClassName('done')[0] //boton "Done" del aviso
const load2 = document.getElementsByClassName('load2')[0] //animacion de carga del aviso
const prepare_msg = document.getElementsByClassName('prepare-msg')[0] //mensaje de aviso
const final = document.getElementsByClassName('final-download')[0] //enlace de descarga final (redireccion)

let actual_url
let down_name
let total_info

//funcion para crear options en dependencia de los itags disponibles
function create_option(itag) {
    let option = document.createElement('option')
    let value
    if (itag == 22) value = "mp4 720p"
    else if (itag == 18) value = "mp4 360p"
    else if (itag == 37) value = "mp4 1080p"
    else if (itag == 140) value = "Audio"
    else value = "unknown"

    option.value = itag
    option.innerHTML = value
    option.classList.add('option')
    return option
}

url_form.addEventListener('submit', event => {
    event.preventDefault()
    download_section.style.visibility = "visible"
    download_section.style.opacity = "0"
    loader.style.display = "flex"
    video_img.src = ``
    let delete_option = document.querySelectorAll('.option')
    delete_option.forEach(i => {
        i.remove()
    })

    actual_url = document.getElementById('url').value

    const data = {
        url: document.getElementById('url').value
    }

    fetch('/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.success) {
        
                total_info = data.info
                video_name.innerHTML = data.name
                down_name = data.name
                video_img.src = `https://img.youtube.com/vi/${data.id}/maxresdefault.jpg`
                for (let i of data.itag) {
                    select_ql.appendChild(create_option(i))
                }
                download_section.style.opacity = "1"
                loader.style.display = "none"

            }
            else {
                loader.style.display = "none"
                alert("Invalid URL or error getting video information")

            }

        })
})

itag_form.addEventListener('submit', event => {
    event.preventDefault()
    prepare.style.top = "0"
    done.style.visibility = "hidden"
    done.style.opacity = "0"
    prepare_msg.innerHTML = `Preparing file... <br> <span style="color: rgb(120, 120, 120); font-size: 70%;">don't close this page</span>`
    load2.style.opacity = "1"

    data = {
        url: actual_url,
        itag: select_ql.value,
        name: down_name,
        formats: total_info
    }

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            
           return response.json()
        })
        .then((data) => {

            done.style.visibility = "visible"
            done.style.opacity = "1"
            prepare_msg.innerHTML = `File is ready <span style="font-size: 100%; font-weight: bold; color: green;">✓</span>`
            load2.style.opacity = "0"

            setTimeout(() => {
                prepare.style.top = "-50rem"
            }, 10000)


            
            const a = document.createElement('a')
            a.href = data.ruta
            a.download ="yt.download - " + data.name
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()
        })
        .catch((error) => {
            console.error('Error al descargar el archivo:', error)
            prepare.style.top = "-50rem"
            alert("Error downloading file 🥲")
        })

})

done.addEventListener('click', () => {
    prepare.style.top = "-50rem"
})