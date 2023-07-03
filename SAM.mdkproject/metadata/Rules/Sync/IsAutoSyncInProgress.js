import libComm from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function IsAutoSyncInProgress(context) {
    try {
        return libComm.getStateVariable(context, 'SyncInProgress') && libComm.getStateVariable(context, 'IsAutoSync');
    } catch (error) {
        Logger.error('SyncIcon', error);
        return false;
    }
}
