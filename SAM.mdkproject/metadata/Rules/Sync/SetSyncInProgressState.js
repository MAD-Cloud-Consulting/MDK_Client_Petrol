/**
* Set Sync State
* @param {IClientAPI} context
*/
import libComm from '../Common/Library/CommonLibrary';

export default function SetSyncInProgressState(context, flag) {
    return libComm.setStateVariable(context, 'SyncInProgress', flag);
}
