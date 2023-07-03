import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function CurrentTime(context) {
    let currentTime = context.evaluateTargetPath('#Control:ReadingTimeControl/#Value');
    if (currentTime.toString() === 'Invalid Date') {
        currentTime = new Date();
    }
    let odataDate = new ODataDate(currentTime);
    let time = odataDate.toDBTimeString(context).split(':');
    return time[0] + ':' + time[1];
}
