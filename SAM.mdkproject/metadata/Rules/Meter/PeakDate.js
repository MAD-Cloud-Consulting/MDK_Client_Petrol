import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function PeakDate(context) {
    let date = null;
    const isPeakReading = context.evaluateTargetPath('#Control:PeakTimeSwitch/#Value');

    if (isPeakReading) {
        let peakDate = new Date(context.evaluateTargetPath('#Control:PeakUsageTimeControl/#Value'));
        let odataDate = new ODataDate(peakDate);
        date = odataDate.toDBDate(context);
    }
    
    return date;
}
