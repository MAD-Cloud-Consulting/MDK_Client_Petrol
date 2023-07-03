import GetCloseOrCancelAction from '../Common/GetCloseOrCancelAction';
import common from '../Common/Library/CommonLibrary';
import crew from './CrewLibrary';

export default function ClearFlagsAndClose(context) {
    const finalAction = GetCloseOrCancelAction(context); 
    common.setOnCreateUpdateFlag(context, '');
    if (crew.getTimesheetRemoveFlag() === true) {
        crew.setTimesheetRemoveFlag(false);
        return context.executeAction('/SAPAssetManager/Actions/Crew/CrewEmployeeRemove.action').then(() => {
            return context.executeAction(finalAction);
        });
    } else {
        crew.setTimesheetRemoveFlag(false);
        return context.executeAction(finalAction);
    }
}
