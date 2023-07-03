import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderRelatedHistoryEntitySet(sectionProxy) {
    let binding = sectionProxy.binding;
    let odataType = binding['@odata.type'];

    if (odataType === '#sap_mobile.MyWorkOrderHeader' || odataType === '#sap_mobile.MyNotificationHeader') { 
         if (!libVal.evalIsEmpty(binding.HeaderEquipment)) {
            return binding['@odata.readLink'] + '/Equipment/RelatedWOHistory';
         } else {
            return binding['@odata.readLink'] + '/FunctionalLocation/RelatedWOHistory';
         }
    } else {
        if (libCommon.isDefined(binding.WorkOrderHeader) && binding.WorkOrderHeader[0]) {
            if (odataType === '#sap_mobile.MyEquipment' && !libVal.evalIsEmpty(binding.WorkOrderHeader[0]['@odata.readLink'].HeaderEquipment)) {
                return binding.WorkOrderHeader[0]['@odata.readLink'] + '/Equipment/RelatedWOHistory';
            }
            if (odataType === '#sap_mobile.MyFunctionalLocation' && !libVal.evalIsEmpty(binding.WorkOrderHeader[0]['@odata.readLink'].HeaderFunctionLocation)) {
                return binding.WorkOrderHeader[0]['@odata.readLink'] + '/FunctionalLocation/RelatedWOHistory';
            } else {
                return binding['@odata.readLink'] + '/RelatedWOHistory';
            } 
        } else {
            return binding['@odata.readLink'] + '/RelatedWOHistory';
        }
    }
}
