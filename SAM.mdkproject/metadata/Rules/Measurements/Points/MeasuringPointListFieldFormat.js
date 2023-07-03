import libPoint from '../MeasuringPointLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';
export default function MeasuringPointListFieldFormat(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return ValueIfExists(libPoint.measuringPointListFieldFormat(pageClientAPI));
}
