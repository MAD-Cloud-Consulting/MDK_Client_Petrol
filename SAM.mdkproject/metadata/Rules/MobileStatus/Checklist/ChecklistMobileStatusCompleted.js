import libCommon from '../../Common/Library/CommonLibrary';

export default function ChecklistMobileStatusCompleted(context) {
    return libCommon.getAppParam(context, 'CHECKLISTS', 'MobileStatusCompleted');    
}
