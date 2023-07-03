import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function BeforeCreateConfirmation(context) {
    // at the time of completion, the changeset should be created on save
    if (IsCompleteAction(context) && context.binding && context.binding.IsOnCreate) {
        CommonLibrary.setOnChangesetFlag(context, true);
        CommonLibrary.resetChangeSetActionCounter(context);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateChangeset.action',
            'Properties': {
                'Actions': [
                    '/SAPAssetManager/Actions/Confirmations/CheckRequiredFieldOnConfirmations.action',
                ],
            },
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/Confirmations/CheckRequiredFieldOnConfirmations.action');
}
