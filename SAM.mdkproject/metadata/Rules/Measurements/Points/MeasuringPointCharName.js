export default function MeasuringPointCharName(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (binding.hasOwnProperty('CharName')) {
        return binding.CharName;
    } else {
        return binding.MeasuringPoint.CharName;
    }
}
