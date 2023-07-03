import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function CurrentDate(context) {
    let currentDate = new Date(context.evaluateTargetPath('#Control:ReadingTimeControl/#Value'));
    if (currentDate.toString() === 'Invalid Date') {
        currentDate = new Date();
    }
    let odataDate = new ODataDate(currentDate);
    return odataDate.toDBDateString(context);
}
