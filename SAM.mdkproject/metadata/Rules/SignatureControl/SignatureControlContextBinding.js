import libCommon from '../Common/Library/CommonLibrary';
import getParentBinding from './SignatureControlParentBinding';

export default function SignatureControlContextBinding(context) {

    let parent = getParentBinding(context);

    switch (parent['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            context._context.binding = parent;
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            //As per Kunal, signatures need to be created at the current assignment level
            if (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation') {
                context._context.binding = parent;
            } else {
                context._context.binding = parent.WOHeader;
            }
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation':  {
            //As per Kunal, signatures need to be created at the current assignment level
            if (libCommon.getWorkOrderAssnTypeLevel(context) === 'SubOperation') {
                context._context.binding = parent.WorkOrderOperation; // save to operation since document uploads for suboperations are not supported
            } else {
                context._context.binding = parent.WorkOrderOperation.WOHeader;
            }
            break;
        }
    }
   return context;
}
