/**
* Returns true if EquipId is available
* @param {IClientAPI} context
*/
export default function InspectionPointsEquipmentSectionIsVisible(context) {
    return context.getPageProxy().binding.EquipNum ? true : false;
}
