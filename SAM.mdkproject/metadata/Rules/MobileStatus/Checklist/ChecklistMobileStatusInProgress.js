import libCommon from '../../Common/Library/CommonLibrary';

export default function ChecklistMobileStatusInProgress(context) {
    return libCommon.getAppParam(context, 'CHECKLISTS', 'MobileStatusInProgress');    
}
