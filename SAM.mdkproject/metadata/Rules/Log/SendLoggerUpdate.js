import libCom from '../Common/Library/CommonLibrary';
export default function SendLoggerUpdate(context) {
    var control = context.getPageProxy().getControl('FormCellContainer');
    var dict = libCom.getControlDictionaryFromPage(context);
    dict.LogLevelLstPkr.clearValidation();
    if (control.getControls()[0].getValue()) {
        context.executeAction('/SAPAssetManager/Actions/Logger/CheckRequiredFieldOnLogger.action');
    }
}
