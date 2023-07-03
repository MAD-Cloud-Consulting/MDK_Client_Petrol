import libCommon from '../../Common/Library/CommonLibrary';

export default function SignatureCreateOnFailure(context) {
    libCommon.removeStateVariable(context, 'LAMSignature');
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');
    libCommon.removeStateVariable(context, 'ContextMenuBindingObject');
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateFailure.action');
}
