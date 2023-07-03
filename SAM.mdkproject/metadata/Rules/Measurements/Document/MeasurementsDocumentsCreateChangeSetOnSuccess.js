import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

/**
 * After changeset success, reset the state variables
 */
export default function MeasurementDocumentsCreateChangeSetOnSuccess(pageProxy) {
    libCommon.resetChangeSetActionCounter(pageProxy);
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    let saved = libCommon.getStateVariable(pageProxy, 'FDCReadingSaved');
    if (saved) {  //Only display toast message if a row was saved
        let index = 0;
        let lamObjects = pageProxy.getClientData().LamPoints;
        let numObjs = Object.keys(lamObjects).length;
        libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'Reading');
        if (lamObjects && numObjs > 0) {
            libCommon.setStateVariable(pageProxy, 'LAMCreateType', 'MeasurementPoint');
            let actionExecutor = function() {
                if (index < numObjs) {
                    pageProxy.setActionBinding(lamObjects[Object.keys(lamObjects)[index]]);
                } else {
                    return Promise.resolve(true);
                }
                return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMMeasurementPointDataCreateForFDC.action').then(() => {
                    index++;
                    return actionExecutor().then((actionResult) => {
                        Promise.resolve(actionResult);
                    });
                });
            };
            return actionExecutor().then(() => {
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return CreateEntitySuccessMessageNoClosePageWithAutoSync(pageProxy);
                });
            });
        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return CreateEntitySuccessMessageNoClosePageWithAutoSync(pageProxy);
            });
        }   
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
