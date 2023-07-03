/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsValidateAllButtonVisible(context) {
    let sections = context._control._parent.sectionsContexts;
    let count = 0;
    if (sections && sections.length > 0) {
        for (let i=0; i < sections.length; i++) {
            if (count > 1) {
                return true;
            }
            if (context._control._parent.sectionsContexts[i].binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                count++;
            }
        }
    }
    return false;
}
