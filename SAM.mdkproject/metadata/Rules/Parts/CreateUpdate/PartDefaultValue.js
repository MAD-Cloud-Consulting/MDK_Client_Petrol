
export default function PartDefaultValue(context) {
    let plant = context.getPageProxy().binding.Plant;
    let storageLoc = context.getPageProxy().binding.StorageLocation;
    let materialNum = context.getPageProxy().binding.MaterialNum;
    if (context.binding['@odata.type'] === '#sap_mobile.BOMItem') {
        materialNum = context.binding.Component;
    }
    if (plant && storageLoc && materialNum) {
        return `MaterialSLocs(Plant='${plant}',StorageLocation='${storageLoc}',MaterialNum='${materialNum}')`;
    } else {
        return '';
    }
}
