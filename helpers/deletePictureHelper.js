const fs = require('fs/promises');


const deletePicture = (data) => {
    const picName = data.split(':3000/')[ 1 ];
    fs.unlink(`./public/${picName}`)
        .then(() => {
            console.log("File has been deleted")
        })
        .catch(async (error) => {
            console.log(error)
            await fs.appendFile('./log.txt', `${error} \n`, 'utf8')
        })

}

module.exports = deletePicture;