import libPoint from '../MeasuringPointLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointFieldFormat(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let value = libPoint.measuringPointFieldFormat(pageClientAPI);
    return libVal.evalIsEmpty(value) ? '-' : value;

}
