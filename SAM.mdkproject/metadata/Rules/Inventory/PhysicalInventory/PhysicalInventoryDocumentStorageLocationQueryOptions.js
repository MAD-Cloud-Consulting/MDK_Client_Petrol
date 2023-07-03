import libCom from '../../Common/Library/CommonLibrary';
import {GlobalVar} from '../../Common/Library/GlobalCommon';

export default function PhysicalInventoryDocumentStorageLocationQueryOptions() {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    let storageLocation = libCom.getUserDefaultStorageLocation();

    if (plant && storageLocation) {
        return `$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$orderby=StorageLocation`;
    } else if (plant) {
        return `$filter=Plant eq '${plant}'&$orderby=StorageLocation`;
    }
    return '$orderby=StorageLocation';
}
