export default function MeasuringPointValue(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (binding.hasOwnProperty('Point')) {
        return binding.Point;
    } else {
        return binding.MeasuringPoint.Point;
    }
}
