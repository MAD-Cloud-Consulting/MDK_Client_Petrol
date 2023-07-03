import libVal from '../Common/Library/ValidationLibrary';

export default function InspectionCharacteristicsPageCaption(context) {
    let inspectionCharacteristics = context.binding;

    if (!libVal.evalIsEmpty(inspectionCharacteristics) && !libVal.evalIsEmpty(inspectionCharacteristics.ShortDesc)) {
        return inspectionCharacteristics.ShortDesc;
    } else {
        return '-';
    }
}
