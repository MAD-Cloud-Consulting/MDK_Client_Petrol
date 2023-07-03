
export default function ObjectKeyFromMap(context) {
    let clientData = context.getPageProxy().getClientData();
    let objectKey = '';

    var extension = context.getControl('MapExtensionControl')._control;
    if (extension) {
        clientData.ObjectKey = extension.getEditModeInfo().objectKey;
        objectKey = clientData.ObjectKey;
    } else {
        if (context.getPageProxy().currentPage.editModeInfo) {
            clientData.ObjectKey = context.getPageProxy().currentPage.editModeInfo.objectKey;
            objectKey = clientData.ObjectKey;
        }
    }

    return objectKey;
}
