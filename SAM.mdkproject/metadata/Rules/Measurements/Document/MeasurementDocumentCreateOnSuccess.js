import libCommon from '../../Common/Library/CommonLibrary';
import isLAMMP from '../../LAM/LAMIsEnabledMeasuringPoint';
import lamObject from '../../LAM/LAMObjectFromControls';


export default function MeasurementDocumentCreateOnSuccess(context) {
    let onChangeSet = libCommon.isOnChangeset(context);

    if (onChangeSet) {
        libCommon.incrementChangeSetActionCounter(context);
        if (isLAMMP(context)) {
            let pageProxy = context.getPageProxy();
            var LamPoints = pageProxy.getClientData().LamPoints;
            let controls = libCommon.getControlDictionaryFromPage(context);
            let lamObj = lamObject(controls);
            if (lamObj) {
                LamPoints[lamObj.Point] = lamObj;
            }
        } 
    } else {
        if (isLAMMP(context)) {
            let Point = context.binding.Point;
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${Point}')/LAMObjectDatum_Nav`, [], '').then(rows => {
                if (rows && rows.length > 0) {
                    libCommon.setStateVariable(context, 'LAMDefaultRow', rows.getItem(0));
                }
                libCommon.setStateVariable(context, 'ObjectCreatedName', 'Reading');
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action').then(() => {
                    libCommon.setStateVariable(context, 'LAMCreateType', 'MeasurementPoint');
                    return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
                });
            });
        } else {
            libCommon.setStateVariable(context, 'ObjectCreatedName', 'Reading');
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        }
    }
}
