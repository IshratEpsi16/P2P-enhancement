const convertKeysToLowerCase = (arr: any[]) => {
    return arr.map(obj => {
        const newObj: any = {};
        Object.keys(obj).forEach(key => {
            newObj[key.toLowerCase()] = obj[key];
        });
        return newObj;
    });
};

export default convertKeysToLowerCase;