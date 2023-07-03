
export default function ErrorArchiveAllNav(context) {
    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu = true;
    return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorsArchive.action');
}

