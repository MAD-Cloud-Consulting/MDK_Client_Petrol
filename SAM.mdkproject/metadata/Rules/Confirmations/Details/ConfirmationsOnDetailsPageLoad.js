
export default function ConfirmationsOnDetailsPageLoad(context) {

    // If this is a final confirmation, hide it
    let binding = context.getBindingObject();
    if (!binding['@sap.isLocal']) {
        context.setActionBarItemVisible(0, false);
    }
}
