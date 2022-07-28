const fs = require('fs');


const deletePicture = (data) => {
    const picName = data.imageUrl.split('/images/')[ 1 ];

    fs.unlink(`./images/${picName}`, (error) => {
        if (error) return console.log("File not found");
        console.log("File have been deleted");
    })
}

module.exports = deletePicture;