import dateTime from './CharacteristicsFormatBackendTimeToLocal';
import fixTime from  './CharacteristicFixTime';

export default function CharacteristicsTimeDisplayValue(context,time) {
    var timeString = time.toString();    
    timeString = fixTime(timeString);
    return context.formatTime(dateTime(context, timeString));
}
