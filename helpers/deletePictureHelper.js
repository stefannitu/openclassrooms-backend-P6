const fs = require('fs');


const deletePicture = (data) => {
    const picName = data.imageUrl.split('/images/')[ 1 ];
    fs.unlinkSync(`./public/images/${picName}`, (error) => {
        if (error) {
        return console.log("Picture not deleted");;            
    }})    
}

module.exports = deletePicture;