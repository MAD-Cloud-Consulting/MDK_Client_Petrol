/**
* Get Sync State
* @param {IClientAPI} context
*/
import libComm from '../Common/Library/CommonLibrary';

export default function IsSyncInProgress(context) {
    return libComm.getStateVariable(context, 'SyncInProgress');
}
