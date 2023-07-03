/**
* Returns true if the CalculatedCharFlag is not set
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsRecordDefectIsVisible(context) {
    if (context.binding.Valuation === 'R') {
        return true;
    } else {
        return false;
    }
}
