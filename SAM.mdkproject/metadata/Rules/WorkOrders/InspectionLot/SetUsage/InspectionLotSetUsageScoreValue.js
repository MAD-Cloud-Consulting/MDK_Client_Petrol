import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionLotSetUsageScoreValue(context) {
    if (!libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
        return context.binding.InspectionCode_Nav.QualityScore;
    }
}
