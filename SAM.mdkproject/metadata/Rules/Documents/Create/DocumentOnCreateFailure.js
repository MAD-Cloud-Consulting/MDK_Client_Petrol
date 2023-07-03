import libCom from '../../Common/Library/CommonLibrary';
export default function DocumentOnCreateFailure(context) {
    libCom.clearDocDataOnClientData(context);
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateFailure.action');         
}
