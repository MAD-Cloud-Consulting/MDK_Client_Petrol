import common from '../Common/Library/CommonLibrary';

export default function ResetPeriodicAutoSync(context) {
    const intervalID = common.getStateVariable(context, 'autoSyncIntervalID');
    if (intervalID) {
        clearInterval(intervalID);
        common.removeStateVariable(context, 'autoSyncIntervalID');
    }
}
