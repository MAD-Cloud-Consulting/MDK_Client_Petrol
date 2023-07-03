import {GlobalVar} from '../../Common/Library/GlobalCommon';

export default function PhysicalInventoryDocumentPlant(context) {
    if (context.binding) {
        return context.binding.Plant;
    }
    return GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
}
