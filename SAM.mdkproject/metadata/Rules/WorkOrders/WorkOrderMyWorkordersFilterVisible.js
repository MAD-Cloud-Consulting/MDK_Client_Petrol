import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderMyWorkordersFilter(context) {
    return !(libCom.getWorkOrderAssignmentType(context) === '1');
}
