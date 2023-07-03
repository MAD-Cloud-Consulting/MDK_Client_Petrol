export function isISUInstall(isuArray) {
    for (let i = 0; i < isuArray.length; i ++) {
        if (isuArray[i].ISUProcess === 'INSTALL') {
            return true;
        }
    }
    return false;
}

export function isISUReplace(isuArray) {
    for (let i = 0; i < isuArray.length; i ++) {
        if (isuArray[i].ISUProcess === 'REPLACE') {
            return true;
        }
    }
    return false;
}
