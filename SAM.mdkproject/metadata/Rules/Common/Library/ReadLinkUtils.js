/**
 * Splits a ReadLink's keys into a key-value pair object
 * If ReadLink contains a single key, a string is returned
 *
 * Example: MaterialSLocs(MaterialNum='112',Plant='1000',StorageLocation='0001') => {MaterialNum : '112', Plant : '1000', StorageLocation: '0001'}
 *
 * Example: MyWorkOrderHeaders('10000000') => '10000000'
 * @param {String} readLink OData ReadLink to be split
 * @returns {*} String or Object corresponding to input ReadLink's keys
 */

 export function SplitReadLink(readLink) {
    let splitReadLink = readLink.match(/[A-z]+='[A-z0-9%-]+'/g);
    if (splitReadLink !== null) {
        return splitReadLink.reduce(function(obj, e) {
            let keyParts = e.split('=');
            obj[keyParts[0]] = keyParts[1].replace(/'([A-z0-9%-]+)'/g, '$1');
            return obj;
        }, {});
    } else {
        return readLink.match(/'[A-z0-9%-]'/)[0].replace(/'([A-z0-9%-]+)'/g, '$1');
    }
}

/**
 * Compares two strings, both containing a valid OData ReadLink
 * @param {String} a First ReadLink to compare
 * @param {String} b Second ReadLink to compare
 * @returns {Boolean} True if all keys are equal; false if otherwise
 */
export function CompareReadLink(a, b) {
    let objA = SplitReadLink(a);
    let objB = SplitReadLink(b);

    let isEqual = true;

    for (let key in objA) {
        if (!objB[key] || objA[key] !== objB[key]) {
            isEqual = false;
            break;
        }
    }

    return isEqual;
}
