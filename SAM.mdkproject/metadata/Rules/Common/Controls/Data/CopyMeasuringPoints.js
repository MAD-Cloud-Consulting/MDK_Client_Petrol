import libCommon from '../../Library/CommonLibrary';
import allItems from '../Items/ReferenceItems';

export default function CopyMeasuringPoints(context) {
    let values = libCommon.getStateVariable(context, 'CopyValues');
    let checked = false;

    if (values.length !== allItems(context).length) {
        checked = !!values.find(oValue => oValue.ReturnValue === 'MEASURING_POINTS_TO_COPY');
    } else {
        checked = true;
    }

    return checked ? 'X' : '';
}
