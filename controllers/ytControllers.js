const ytdl = require('ytdl-core')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto') 

class ytControllers {

    static async res_index(req, res) {
        res.status(200).sendFile(path.join(__dirname, '..', 'views', 'index.html'))
    }

    static async url(req, res) {

        const url_info = async (req) => {

            let response
            let itag = []
            let name
            let id

            try {

                const info = await ytdl.getInfo(req.body.url)

                for (let format of info.formats) {
                    if (format.container == 'mp4' && format.audioQuality != undefined && format.qualityLabel != null) {
                        itag.push(format.itag)
                    }
                }

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

                return response

            }
            catch (err) {
                console.error("invalid url")
                return { success: false }
            }
        }
        if (url_info == undefined) {
            console.error("we can't get the information of the video")
            res.json({
                error: "we can't get the information of the video" 
            })
        }
        res.json(await url_info(req))
    }

    static async download(req, res) {
        const download = async (req) => {

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
        res.json(await download(req))
    }
}

module.exports = ytControllers


