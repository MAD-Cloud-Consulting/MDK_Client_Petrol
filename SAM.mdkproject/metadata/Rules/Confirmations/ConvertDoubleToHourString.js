

export default function ConvertDoubleToHourString(double) {

    let hours = Math.floor(double);
    let minutes = double - Math.floor(double); // Retrieve the decimal
    minutes = Math.round(minutes * 60); // Convert to minutes

    if (minutes === 60) {
        hours += 1;
        minutes = 0;
    }

    return `${hours}:` + (minutes < 10 ? `0${minutes}` : minutes);

}
