import common from '../../Common/Library/CommonLibrary';
export default function GetFormattedVendorText(clientAPI) {
    return common.getVendorName(clientAPI,clientAPI.binding.Vendor);
}
