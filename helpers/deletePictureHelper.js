const fs = require('fs');


const deletePicture = (data) => {
    const picName = data.imageUrl.split('/images/')[ 1 ];
    fs.unlinkSync(`./images/${picName}`, (error) => {
        if (error) console.log("File has not been deleted");
        return false;
    })
    return true
}

module.exports = deletePicture;