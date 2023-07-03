/**
* This rule will return true if network connectivity is available, false otherwise.
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import NativeScriptObject from './Library/NativeScriptObject';
export default function CheckForConnectivity(context) {
    const connectivityModule = NativeScriptObject.getNativeScriptObject(context).connectivityModule;
    const connectionType = connectivityModule.getConnectionType();
    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'connectionType = ' + connectionType);
    return (connectionType === connectivityModule.connectionType.none) ? false : true;
}
