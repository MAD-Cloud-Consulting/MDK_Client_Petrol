export default function SerialNumbersTrailingItems(context) {
    
    let actions = [];

    if (context.binding.IsLocal) { //Only local serial numbers can be removed
        actions.push('Delete_Item');
    }

    return actions;
}
