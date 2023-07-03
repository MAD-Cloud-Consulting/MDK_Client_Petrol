export default function SerialNumbersTrailingItems(context) {
    const deleted = !context.binding.downloaded;
    let actions = [];

    if (deleted) {
        actions.push('Delete_Item');
    }

    return actions;
}
