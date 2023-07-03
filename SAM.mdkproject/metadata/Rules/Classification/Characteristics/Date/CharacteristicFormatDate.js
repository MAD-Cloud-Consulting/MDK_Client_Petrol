export default function CharacteristicFormatDate(date) {
    let month = (date.getMonth()+ 1).toString();
    if (Number(month) < 10) month = '0' + month;
    let day = date.getDate().toString();
    if (Number(day) < 10) day = '0' + day;
    let year = date.getFullYear().toString();
    return year+month+day;
}
