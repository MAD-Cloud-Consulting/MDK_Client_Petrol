import libPoint from './MeasuringPointLibrary';

export default function PointDetailsOnPageLoad(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    libPoint.pointDetailsOnPageLoad(pageClientAPI);
}
