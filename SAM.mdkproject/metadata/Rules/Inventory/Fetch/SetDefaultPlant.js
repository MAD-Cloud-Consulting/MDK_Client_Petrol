import { GlobalVar } from '../../Common/Library/GlobalCommon';
// eslint-disable-next-line no-unused-vars
export default function SetDefaultPlant(context) {
    return GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
}
