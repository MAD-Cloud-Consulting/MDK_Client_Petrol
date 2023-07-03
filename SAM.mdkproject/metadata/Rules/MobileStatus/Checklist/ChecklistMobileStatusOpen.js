import libCommon from '../../Common/Library/CommonLibrary';

export default function ChecklistMobileStatusOpen(context) {
    return libCommon.getAppParam(context, 'CHECKLISTS', 'MobileStatusOpen');    
}
