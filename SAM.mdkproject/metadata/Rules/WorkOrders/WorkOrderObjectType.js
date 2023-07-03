import libCommon from '../Common/Library/CommonLibrary';

export default function WorkOrderObjectType(context) {
    return libCommon.getAppParam(context,'OBJECTTYPE','WorkOrder'); 
}
