import common from '../../Common/Library/CommonLibrary';

export default function EnableCrewManage(context) {
    return (common.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Crew.Manage') === 'Y');
}
