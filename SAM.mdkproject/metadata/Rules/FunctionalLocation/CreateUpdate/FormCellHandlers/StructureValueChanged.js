import libCommon from '../../../Common/Library/CommonLibrary';

export default function StructureValueChanged(context) {
    let pageProxy = context.getPageProxy();
    let maskField = libCommon.getControlProxy(pageProxy, 'IdProperty');

    let value = libCommon.getControlValue(context); 
    if (value) {
        context.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocStructInds('${value}')`, [], '')
            .then(response => {
                if (response && response.length > 0) {
                    let structure = response.getItem(0);
                    libCommon.setStateVariable(pageProxy, 'EditMask', structure.EditMask);
                    maskField.clearValidationOnValueChange();
                    maskField.setHelperText(structure.EditMask);
                    maskField.setEditable(true);
                }
        });
    } else {
        libCommon.setStateVariable(pageProxy, 'EditMask', '');
        maskField.clearValidationOnValueChange();
        maskField.setHelperText('');
        maskField.setEditable(false);
    }
}
