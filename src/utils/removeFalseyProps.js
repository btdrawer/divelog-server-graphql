module.exports = obj => {
    let newObj = { ...obj };
    for (let prop in newObj) {
        if (!newObj[prop]) delete newObj[prop];
    }
    return newObj;
};
