import AutoSyncLib from './AutoSyncLibrary';

export default function AutoSyncOnResume(context) {
    AutoSyncLib.autoSyncPeriodically(context);
    return AutoSyncLib.autoSyncOnAppResume(context);
}
