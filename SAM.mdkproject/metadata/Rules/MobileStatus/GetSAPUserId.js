import libCom from '../Common/Library/CommonLibrary';

export default function GetSAPUserId(context) {

    return libCom.getSapUserName(context);
}
