import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function PeakTime(context) {
    let time = '00:00';
    const isPeakReading = context.evaluateTargetPath('#Control:PeakTimeSwitch/#Value');

    if (isPeakReading) {
        let peakTime = context.evaluateTargetPath('#Control:PeakUsageTimeControl/#Value');
        let odataDate = new ODataDate(peakTime).toDBTimeString(context).split(':');
        time = odataDate[0] + ':' + odataDate[1];
    }

    return time;
}
