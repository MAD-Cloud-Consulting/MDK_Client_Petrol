

export default function ConvertMinutesToHourString(totalMins) {

    let hours = (totalMins / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);

    return `${rhours}:` + (rminutes < 10 ? `0${rminutes}` : rminutes);

}
