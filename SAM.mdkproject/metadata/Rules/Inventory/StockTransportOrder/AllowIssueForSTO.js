import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function AllowIssueForSTO(item) {

    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    let binding = item;

    if (!binding['@odata.type']) { //Possible that item is a context or an actual STO object
        binding = item.binding;
    }
    
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);

    if (type === 'StockTransportOrderHeader') {
        if (plant && plant === binding.SupplyingPlant) {
            return true; //Supplying plant matches user's default plant, so do an issue
        }
    } else if (type === 'StockTransportOrderItem') {
        if (plant && plant === binding.StockTransportOrderHeader_Nav.SupplyingPlant) {
            return true;
        }
    }
    return false;
}
