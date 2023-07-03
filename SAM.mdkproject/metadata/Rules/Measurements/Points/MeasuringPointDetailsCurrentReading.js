import libPoint from '../MeasuringPointLibrary';

export default function MeasuringPointDetailsCurrentReading(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPoint.measuringPointDetailsFieldFormat(pageClientAPI, 'CurrentReading');

}
