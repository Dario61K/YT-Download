    const ytModels = require('../models/ytModels.js')
    const path = require('path')

    class ytControllers{

    static async res_index (req,res){
        res.status(200).sendFile(path.join(__dirname,'..','views','index.html'))
    }
    
    static async res_help (req,res){
        res.status(200).sendFile(path.join(__dirname,'..','views','help.html'))
    }

    static async url (req,res){
        const url_info = await ytModels.url(req)
        console.log(url_info.success)
        res.json(url_info)
    }

    static async download (req,res){
        const download = await ytModels.download(req)
        res.json(download)
    }
} 

module.exports = ytControllers