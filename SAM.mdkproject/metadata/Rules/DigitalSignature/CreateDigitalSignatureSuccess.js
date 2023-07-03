import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function CreateDigitalSignatureSuccess(context) {
    // Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'CreateDigitalSignature result = ' + JSON.stringify(context.actionResults.result));
    // save object id and sign key in user preferences
    context.getClientData().ObjectID = context.binding['@odata.id'];
    return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPrefsSaveSignatureID.action').then((result) => {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'digit_signature', {
                value: context.localizeText('done'),
                link: JSON.parse(result.data)['@odata.editLink'],
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false, {
                'Name': '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action',
                'Properties': {
                    'ClearHistory': true,
                    'Transition': {
                        'Curve': 'EaseOut',
                        'Name': 'SlideRight',
                        'Duration': 0.5,
                    },
                },
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/CreateSignatureSuccess.action');  
    });
}
