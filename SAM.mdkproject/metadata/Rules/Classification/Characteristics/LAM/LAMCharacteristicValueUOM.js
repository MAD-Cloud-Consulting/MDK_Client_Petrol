import libCom from '../../../Common/Library/CommonLibrary';

export default function LAMCharacteristicValueUOM(context) {

    let controls = libCom.getControlDictionaryFromPage(context);
    return libCom.getListPickerValue(controls.UOMLstPkr.getValue());

}
