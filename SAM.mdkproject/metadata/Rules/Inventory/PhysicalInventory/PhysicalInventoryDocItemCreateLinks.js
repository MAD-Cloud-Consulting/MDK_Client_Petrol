import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocItemCreateLinks(context) {

    var links = [];
    let plant = libCom.getStateVariable(context, 'PhysicalInventoryItemPlant');
    let material = context.evaluateTargetPathForAPI('#Control:MatrialListPicker/#SelectedValue').binding;
    let sloc = libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');

    links.push({
        'Property': 'MaterialPlant_Nav',
        'Target':
        {
            'EntitySet': 'MaterialPlants',
            'QueryOptions': "$filter=Plant eq '" + plant + "' and MaterialNum eq '" + material + "'",
        },
    });

    links.push({
        'Property': 'MaterialSLoc_Nav',
        'Target':
        {
            'EntitySet': 'MaterialSLocs',
            'QueryOptions': "$filter=Plant eq '" + plant + "' and MaterialNum eq '" + material + "' and StorageLocation eq '" + sloc + "'",
        },
    });

    links.push({
        'Property': 'Material_Nav',
        'Target':
        {
            'EntitySet': 'Materials',
            'QueryOptions': "$filter=MaterialNum eq '" + material + "'",
        },
    });

    return links;
}
