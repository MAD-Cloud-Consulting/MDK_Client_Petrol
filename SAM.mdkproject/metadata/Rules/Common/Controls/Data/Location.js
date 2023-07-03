export default function Location(location) {
    if (location.length) {
        return location[0].ReturnValue.split('\'')[1];
    }

    return '';
}
