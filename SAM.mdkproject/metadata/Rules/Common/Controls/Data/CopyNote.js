import libCommon from '../../Library/CommonLibrary';
import allItems from '../Items/ReferenceItems';

export default function CopyNote(context) {
    let values = libCommon.getStateVariable(context, 'CopyValues');
    let checked = false;

    if (values.length !== allItems(context).length) {
        checked = !!values.find(oValue => oValue.ReturnValue === 'NOTE_TO_COPY');
    }

    return checked ? 'X' : '';
}
