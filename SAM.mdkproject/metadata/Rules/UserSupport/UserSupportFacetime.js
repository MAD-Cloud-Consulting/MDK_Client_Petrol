import libCom from '../Common/Library/CommonLibrary';

export default function UserSupportFacetime(pageClientAPI) {
    return libCom.getAppParam(pageClientAPI, 'SUPPORT', 'Facetime');
}
