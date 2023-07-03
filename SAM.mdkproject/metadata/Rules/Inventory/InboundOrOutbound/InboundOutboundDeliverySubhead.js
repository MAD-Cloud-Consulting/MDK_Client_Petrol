export default function InboundOutboundDeliverySubhead(context) {
    const plant = context.binding.Plant;
    const sloc = context.binding.StorageLocation;
    const itemNum = context.binding.Item;
    const itemCategory = context.binding.ItemCategory;
    let plantSloc = '';

    if (plant && sloc) {
        plantSloc += ' - ' + plant + '/' + sloc;
    } else if (plant) {
        plantSloc += ' - ' + plant;
    } else if (sloc) {
        plantSloc += ' - ' + sloc;
    }



    return itemNum + plantSloc + ', ' + itemCategory;
}
