import GenerateLocalID from '../Common/GenerateLocalID';
import libCom from '../Common/Library/CommonLibrary';

export default function GenerateNotificationID(context) {
    return GenerateLocalID(context, 'MyNotificationHeaders', 'NotificationNumber', '00000', '$filter=startswith(NotificationNumber, \'LOCAL\') eq true&orderby=NotificationNumber desc', 'LOCAL_N').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
    
}
