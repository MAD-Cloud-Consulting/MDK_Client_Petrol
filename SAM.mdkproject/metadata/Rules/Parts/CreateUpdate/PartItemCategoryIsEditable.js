import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function PartItemCategoryIsEditable(context) {
    if (EnableFieldServiceTechnician(context)) {
        return true;
    }
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return false;
    }
    return true;
}
