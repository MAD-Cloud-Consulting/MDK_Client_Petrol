import dateTime from './CharacteristicsFormatBackendTimeToLocal';
import charValue from '../CharacteristicValueFrom';
import fixTime from './CharacteristicFixTime';

export default function CharacteristicsTime(formCellContainerProxy) {
    let time = charValue(formCellContainerProxy);
    if (time < 0 || isNaN(time)) {
        var currentDate = new Date();
        time = currentDate.getTime();
    }
    // In order to get the correct time we need to pass a six character string in the form HHMMSS
    // On occasion, it comes with 5 digits, indicating it is HMMSS, so pad with a leading zero
    // Sometimes it comes with 4 digits, indicating it HHMM, so pad with trailing zeros for seconds
    time = fixTime(time);

    return dateTime(formCellContainerProxy, time);
}
