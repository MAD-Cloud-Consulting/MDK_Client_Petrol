/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotSetUsageCodeReadLink(context) {
    if (context.getClientData().InspectionCode) {
        return context.getClientData().InspectionCode['@odata.readLink'];
    }
}
