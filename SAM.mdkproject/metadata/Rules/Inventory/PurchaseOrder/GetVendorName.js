import common from '../../Common/Library/CommonLibrary';

export default function GetVendorName(clientAPI) {
    return common.getVendorName(clientAPI,clientAPI.binding.Vendor);
}
