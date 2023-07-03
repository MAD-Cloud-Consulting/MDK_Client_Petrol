import EquipmentChecklistsCount from './Equipment/EquipmentChecklistsCount';
import FunctionalLocationChecklistsCount from './FunctionalLocation/FunctionalLocationChecklistsCount';

export default function ChecklistsCount(context) {
    
    let countPromise;
    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') { 
        countPromise = EquipmentChecklistsCount;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        countPromise = FunctionalLocationChecklistsCount;
    }
    return countPromise(context).then(count => {
        return count;
    });
}
