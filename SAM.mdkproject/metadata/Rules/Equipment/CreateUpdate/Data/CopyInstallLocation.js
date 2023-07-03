import libCommon from '../../../Common/Library/CommonLibrary';
import allItems from '../FormCellHandlers/Items/ReferenceItems';

export default function CopyInstallLocation(context) {
    let values = libCommon.getStateVariable(context, 'CopyValues');
    let checked = false;

    if (values.length !== allItems(context).length) {
        checked = !!values.find(oValue => oValue.ReturnValue === 'INSTALL_LOCATION_TO_COPY');
    }

    return checked ? 'X' : '';
}
