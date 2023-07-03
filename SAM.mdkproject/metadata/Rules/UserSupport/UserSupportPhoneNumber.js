import libCom from '../Common/Library/CommonLibrary';

export default function UserSupportPhoneNumber(pageClientAPI) {
    return libCom.getAppParam(pageClientAPI, 'SUPPORT', 'Phone');
}
