const fs = require('fs/promises')

const deletePicture = async (data) => {
	const picName = data.split(':3000/')[1]

	try {
		await fs.unlink(`./public/${picName}`)
		console.log('File has been deleted')
	} catch (error) {
		console.log(error)
		await fs.appendFile('./log.txt', `${error} \n`, 'utf8')
	}
}

module.exports = deletePicture
