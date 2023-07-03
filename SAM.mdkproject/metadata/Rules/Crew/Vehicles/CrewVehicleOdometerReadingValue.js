
import libLocal from '../..//Common/Library/LocalizationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function CrewVehicleOdometerReadingValue(context) {
    let readingValue = libCom.getFieldValue(context, 'VehicleOdometer', '', null, true);
    if (typeof(readingValue) === 'string' && libCom.isDefined(readingValue)) {
        return libLocal.toNumber(context, readingValue, '', false);
    }
    if (libCom.isDefined(readingValue)) {
        return readingValue;
    }
    return 0;
}
