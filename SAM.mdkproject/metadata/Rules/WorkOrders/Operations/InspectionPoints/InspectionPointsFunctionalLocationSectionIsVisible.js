/**
* Returns true if FuncLocId is available
* @param {IClientAPI} context
*/
export default function InspectionPointsFunctionalLocationSectionIsVisible(context) {
    return context.getPageProxy().binding.FuncLocId ? true : false;
}
