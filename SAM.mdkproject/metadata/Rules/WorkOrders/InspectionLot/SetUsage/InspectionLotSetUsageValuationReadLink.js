/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotSetUsageValuationReadLink(context) {
    if (context.getClientData().InspectionCode && context.getClientData().InspectionCode.InspValuation_Nav) {
        return context.getClientData().InspectionCode.InspValuation_Nav['@odata.readLink'];
    }

}
