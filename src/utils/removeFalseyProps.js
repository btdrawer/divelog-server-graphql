module.exports = obj => {
    let newObj = { ...obj };
    for (let prop in newObj) {
        if (!newObj[prop]) delete newObj[prop];
    }
    if (newObj.id) {
        newObj._id = newObj.id;
        delete newObj.id;
    }
    return newObj;
};
