/**
* Initialize Sync State to use later in the app
* @param {IClientAPI} context
*/
import setSyncInProgressState from './SetSyncInProgressState';

export default function InitializeSyncState(context) {
    setSyncInProgressState(context, false);
}
