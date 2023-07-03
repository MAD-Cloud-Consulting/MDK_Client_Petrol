import libCommon from '../../Common/Library/CommonLibrary';

export default function FunctionalLocationUpdateNav(context) {
    if (context.binding['@sap.isLocal']) {
        let pageProxy = context;
        if (typeof pageProxy.getPageProxy === 'function') { 
            pageProxy = context.getPageProxy();
        }

        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Equipment/DocumentAddEditNav.action');
}
