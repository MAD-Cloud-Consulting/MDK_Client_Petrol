import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function TimeSheetEntryCreateUpdateSubOperationUpdate(controlProxy) {
    let pageProxy = controlProxy.getPageProxy();
    let selection = controlProxy.getValue()[0] ? controlProxy.getValue()[0].ReturnValue : '';

    if (!selection) {//suboperation has been unchecked hence, get the operation's workcenter and set the activity type picker accordingly
        let opListPickerProxy = libCom.getControlProxy(pageProxy,'OperationLstPkr');
        selection = opListPickerProxy.getValue()[0].ReturnValue;

    }
    return libTS.GetWorkCenterFromObject(pageProxy, selection).then(newWorkCenter => {
        if (newWorkCenter) {
            return libTS.updateWorkCenter(pageProxy, newWorkCenter);
        }
        return '';
    }); 
}
