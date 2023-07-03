
export default function CharacteristicFixTime(time) { 
    // In order to get the correct time we need to pass a six character string in the form HHMMSS
    // Left pad with zeros if less than 6 characters

    if (time.length < 6) {
        time = '000000'.substr(1, 6 - time.length) + time;
    }

    return time;
}
