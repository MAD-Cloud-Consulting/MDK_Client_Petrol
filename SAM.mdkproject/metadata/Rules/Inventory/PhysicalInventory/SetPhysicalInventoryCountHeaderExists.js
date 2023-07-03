import libCom from '../../Common/Library/CommonLibrary';
import wrapper from './PhysicalInventoryCountNavWrapper';

export default function SetPhysicalInventoryCountHeaderExists(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'PI'); //Physical Inventory
    libCom.setStateVariable(context, 'IMMovementType', 'C'); //C = count (existing document)
    return wrapper(context);
}
