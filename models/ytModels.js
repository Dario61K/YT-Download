const ytdl = require('ytdl-core')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto') 


class ytModels {

    static async url(req) {
        let response
        let itag = []
        let name
        let id
        console.log("entra en url")
        try {
            console.log("entra en el try")
            console.log(req.body.url)
            const info = await ytdl.getInfo(req.body.url)
            console.log(req.body.url)
            for (let format of info.formats) {
                if (format.container == 'mp4' && format.audioQuality != undefined && format.qualityLabel != null) {
                    itag.push(format.itag)
                }
            }

            console.log('llegada 1')
            itag.sort((a, b) => b - a)
            itag.push(140)
            name = info.videoDetails.title.replace(/[^\w\s.-]/g, '')
            id = info.videoDetails.videoId

            response = {
                success: true,
                itag: itag,
                name: name,
                id: id,
                info: info.formats
            }

            console.log("llega aqui")
            return response

        }
        catch (err) {
            console.error("invalid url")
            return { success: false }
        }
    }


    static async download(req) {
        try {
            let l;
            if (req.body.itag == '140') l = '.m4a'
            else l = '.mp4'
    
            const name = req.body.name + l
            const format = ytdl.chooseFormat(req.body.formats, { quality: req.body.itag })
            console.log(name)
    
            const file_rut = path.join(__dirname, '..', 'public', 'files')
            await fs.promises.access(file_rut)
    
            const newC = crypto.randomUUID()
            await fs.promises.mkdir(path.join(file_rut, newC))
    
            const down = ytdl(req.body.url, { format: format })
            const writee = fs.createWriteStream(path.join(file_rut, newC, name))
            down.pipe(writee);

            return new Promise((resolve, reject) => {
                writee.on('finish', () => {

                    setTimeout(() => {
                        fs.rmdir(path.join(file_rut, newC), { recursive: true }, err => {
                            if (err) console.log("no se pudo borrar el archivo")
                            else console.log("eliminado 1 archivo")
                        })
                    }, 10800000)

                    console.log("Preparing finish")
                    let ruta = path.join('files', newC, name)
                    let response = {
                        ruta: ruta,
                        name: name
                    };
                    resolve(response)
                });
    
                writee.on('error', (error) => {
                    reject(error)
                })
            });
        } catch (error) {
            console.error("Error en la descarga:", error)
            return { success: false }
        }
    }
    


}

module.exports = ytModels