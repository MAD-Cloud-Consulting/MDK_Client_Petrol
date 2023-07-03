/**
 * 
 * @param {*} property a property (preferably a string) that will be evaluated for truthiness. See https://developer.mozilla.org/en-US/docs/Glossary/Truthy for reference
 * @param {String} placeholder a string that will be returned if the specified `property` evaluates to falsy
 * @param {Function?} formatFunc an optional format function that will be applied to the `property` being returned
 */
export function ValueIfExists(property, placeholder = '-', formatFunc) {
    if (property) {
        if (formatFunc) {
            return formatFunc(property);
        } else {
            return property;
        }
    } else {
        return placeholder;
    }
}
/**
 * 
 * @param {*} property a property (preferably a string) that will be returned if `condition` evaluates to true/truthy
 * @param {*} placeholder a string that will be returned if the specified `condition` evaluates to false/falsy
 * @param {*} condition a condition specifying when `property` should be returned
 * @param {*} formatFunc an optional format function that will be applied to the `property` being returned
 */
export function ValueIfCondition(property, placeholder = '-', condition, formatFunc) {
    if (condition) {
        if (formatFunc) {
            return formatFunc(property);
        } else {
            return property;
        }
    } else {
        return placeholder;
    }
}
