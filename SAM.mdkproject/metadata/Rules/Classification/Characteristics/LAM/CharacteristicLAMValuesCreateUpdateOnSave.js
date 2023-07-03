import libCommon from '../../../Common/Library/CommonLibrary';


export default function CharacteristicLAMValuesCreateUpdateOnSave(pageProxy) {
    let onCreate = libCommon.IsOnCreate(pageProxy);

    const controls = libCommon.getControlDictionaryFromPage(pageProxy);
    const binding = controls.ValueLstPkr.binding;
    if (binding) pageProxy.getPageProxy()._context.binding = binding;

    if (onCreate) {
        libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'LinearData');
        return pageProxy.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/LAM/CharacteristicLAMValuesCreate.action');
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/LAM/CharacteristicLAMValuesUpdate.action');
    }

}
