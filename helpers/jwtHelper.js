const jwtCheck = (data) => {
    if (data.userId !== req.userId) {
        return res.status(403).json({ message: "Operation not allowed" })
    }
}

module.exports = jwtCheck