/**
* Determines if a checklist can be created based on the existing checklists and master data 
* @param {IClientAPI} context
*/

import allowEquipmentChecklistsCreate from '../Equipment/AllowChecklistCreateEquipment';
import allowFuncLocChecklistsCreate from '../FunctionalLocation/AllowChecklistCreateFunctionalLocation';

export default function AllowChecklistCreate(context) {
    let binding = context.binding;

    if (binding['@odata.type'] === '#sap_mobile.MyEquipment') { 
        return allowEquipmentChecklistsCreate(context);
    } else if (binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return allowFuncLocChecklistsCreate(context);
    }
}
