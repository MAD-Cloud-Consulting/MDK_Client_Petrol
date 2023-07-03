import common from '../../Common/Library/CommonLibrary';

export default function UnsetChangesetFlagsFailure(context) {
    common.setOnChangesetFlag(context, false);
    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
}
