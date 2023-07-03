import common from '../../Common/Library/CommonLibrary';

/**
 * This function returns the plant object header field on PurchaseOrderItemDetails page
 */
export default function GetPlantName(clientAPI) {
    return common.getPlantName(clientAPI, clientAPI.binding.SupplyingPlant);
}
