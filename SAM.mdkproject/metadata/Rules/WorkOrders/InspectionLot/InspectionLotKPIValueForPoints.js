import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotKPIValueForPoints(context) {
    if (context.binding.hasOwnProperty('InspectionPoints_Nav') && !libVal.evalIsEmpty(context.binding.InspectionPoints_Nav)) {
        var points = context.binding.InspectionPoints_Nav;
        let nonEmpty = 0;
        for (let i = 0; i < points.length; i++) {
            if (!libVal.evalIsEmpty(points[i].ValuationStatus)) {
                nonEmpty++;
            }
        }
        return nonEmpty + '/' + points.length;
    }
    return '0/0';
}
