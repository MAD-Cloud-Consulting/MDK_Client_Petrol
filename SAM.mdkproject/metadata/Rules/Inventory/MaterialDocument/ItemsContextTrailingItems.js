export default function ItemsContextTrailingItems(context) {
    const local = context.binding['@sap.isLocal'];
    let actions = [];

    if (local) {
        actions.push('Delete_Item');
    }

    return actions;
}
