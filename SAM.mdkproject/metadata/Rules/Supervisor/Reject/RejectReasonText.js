import { NoteLibrary as NoteLib } from '../../Notes/NoteLibrary';
import NoteViewValue from '../../Notes/NoteViewValue';
import PersonaLib from '../../Persona/PersonaLibrary';

export default function RejectReasonText(context) {
    
    let pageProxy = context.getPageProxy();
    let businessObject = pageProxy.binding;
    let code = '';

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        if (businessObject.OrderMobileStatus_Nav) {
            code = businessObject.OrderMobileStatus_Nav.ReasonCode;
        }
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (businessObject.OperationMobileStatus_Nav) {
            code = businessObject.OperationMobileStatus_Nav.ReasonCode;
        }
    }
    if (code.replace(/^0*/, '')) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', "RejectionReasons('" + code + "')", ['ReasonDescription'], '').then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                return row.ReasonDescription;
            }
            return '-';
        });
    }
    if (PersonaLib.isFieldServiceTechnician(context)) {
        let page = pageProxy._page._definition.getName();
        if (NoteLib.didSetNoteTypeTransactionFlagForPage(pageProxy, page)) {
            return NoteViewValue(pageProxy);
        }
    }
    return '';
}
