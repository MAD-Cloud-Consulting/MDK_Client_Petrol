import AutoSyncLib from './AutoSyncLibrary';

export default function AutoSyncOnSave(context) {
    AutoSyncLib.autoSyncOnSave(context);
    return Promise.resolve(true);
}
