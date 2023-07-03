import libCom from '../Common/Library/CommonLibrary';

export default function UserSupportEmailId(pageClientAPI) {
    return libCom.getAppParam(pageClientAPI, 'SUPPORT', 'Email');
}
