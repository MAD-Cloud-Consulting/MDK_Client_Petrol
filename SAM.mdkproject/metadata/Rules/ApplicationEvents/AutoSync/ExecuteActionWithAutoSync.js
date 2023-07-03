import AutoSyncLib from './AutoSyncLibrary';

export default function ExecuteActionWithAutoSync(context, actionName) {
    AutoSyncLib.autoSyncOnSave(context);
    return context.executeAction(actionName);
}
