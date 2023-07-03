/** Clear the state variable when user hit Cancel */
import cleanClientData from './CharacteristicCleanUp';
import libCom from '../../Common/Library/CommonLibrary';

export default function CharacteristicCleanUpOnCancel(pageProxy) {
    libCom.setOnCreateUpdateFlag(pageProxy, '');
    cleanClientData(pageProxy);
    return pageProxy.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
