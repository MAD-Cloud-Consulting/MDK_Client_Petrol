import CommonLibrary from '../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function MileageAddEditMileage(pageProxy) {
    let controlValue = CommonLibrary.getFieldValue(pageProxy, 'MileageSim', '', null, true);
    return LocalizationLibrary.toNumber(pageProxy, controlValue, '', false);
}
