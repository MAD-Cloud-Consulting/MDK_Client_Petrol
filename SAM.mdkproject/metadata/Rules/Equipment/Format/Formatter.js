export function ValueIfExists(property, placeholder, formatFunc) {
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
export function ValueIfCondition(property, placeholder, condition, formatFunc) {
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
