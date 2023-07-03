import libCommon from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeSignature(context) {
     //check if signature creation was called from context menu
    if (context.getPageProxy().getExecutedContextMenuItem()) {
        libCommon.setStateVariable(context, 'ContextMenuBindingObject', context.getPageProxy().getExecutedContextMenuItem().getBinding());
    }
    libCommon.setStateVariable(context, 'SignatureValue', undefined);
    
    let link = WorkOrderCompletionLibrary.getStepDataLink(context, 'signature');
    if (link) {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/SignatureControl/View/DownloadSignature.action', 'Properties': {
            'Target': {
                'ReadLink': link,
                'EntitySet' : 'Documents',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
            },
        }}).then(result => {
            libCommon.setStateVariable(context, 'SignatureValue', result);
            return context.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action')
                .catch(err => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySignature.global').getValue(), err);
                    return Promise.reject(false);
                });
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action')
        .catch(err => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySignature.global').getValue(), err);
            return Promise.reject(false);
        });
}
