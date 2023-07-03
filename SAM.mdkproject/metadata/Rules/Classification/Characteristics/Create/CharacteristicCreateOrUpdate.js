import isLocalChar from '../CharacteristicIsLocalChar';
import charCreateAction from '../CharacteristicCreateAction';
import libCom from '../../../Common/Library/CommonLibrary';

export default function CharacteristicCreateOrUpdate(context) {   
    if (!libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
    if (isLocalChar(context)) {
        return charCreateAction(context);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicUpdate.action');
    }
}
