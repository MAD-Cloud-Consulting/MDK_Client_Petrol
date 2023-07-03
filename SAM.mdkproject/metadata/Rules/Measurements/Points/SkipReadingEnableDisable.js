import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function SkipReadingEnableDisable(context) {
    let nameSplit = context.getName().split('_');
    if (nameSplit.length < 3) {
        Logger.error('Provided control does not appear to be from a Field Data Capture container');
        return;
    }
    let controlSuffix = '_' + nameSplit[nameSplit.length - 2] + '_' + nameSplit[nameSplit.length - 1];

    let setEditableFunction = libCommon.setFormcellNonEditable;
    if (!context.getValue()) {
        setEditableFunction = libCommon.setFormcellEditable;
    }

    let controlNames = ['ReadingSim',
                        'ValuationCodeLstPkr',
                        'ShortTextNote'];
    for (let controlName of controlNames) {
        let resolvedName = controlName + controlSuffix;
        let resolvedControl = libCommon.getControlProxy(context.getPageProxy(), resolvedName);
        setEditableFunction(resolvedControl);
    }
}
