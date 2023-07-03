import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function GetMaterialDocumentItemReadLink(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);
    let binding = isMultipleTechnician ? context.getClientData() : context.binding;
    if (!binding || (Object.keys(binding).length === 1 && binding.actionResults)) {
        binding = context.getActionBinding();
    }
    if (binding.TempLine_MatDocItemReadLink) {
        return binding.TempLine_MatDocItemReadLink;
    }
    //Get the material document item key for updating during create related entity action
    return "MaterialDocItems(MatDocItem='" + binding.TempItem_Key + "',MaterialDocNumber='" + binding.TempHeader_Key + "',MaterialDocYear='" + binding.TempHeader_MaterialDocYear + "')";

}
