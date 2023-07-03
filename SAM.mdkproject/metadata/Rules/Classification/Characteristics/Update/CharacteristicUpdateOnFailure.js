/** Clear the state variable when the update fails */
import libCom from '../../../Common/Library/CommonLibrary';
export default function CharacteristicUpdateOnFailure(pageProxy) {
    libCom.setStateVariable(pageProxy,'CharValCountIndex', 0);
    return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}
