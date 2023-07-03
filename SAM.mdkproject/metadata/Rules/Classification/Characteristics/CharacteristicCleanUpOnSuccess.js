/** Clear the state variable when user hit Done and if Success */
import cleanClientData from './CharacteristicCleanUp';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function CharacteristicCleanUpOnSuccess(pageProxy) {
    pageProxy.evaluateTargetPath('#Page:-Previous/#ClientData').didUpdateEntity = true;
    cleanClientData(pageProxy);
    return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
}
