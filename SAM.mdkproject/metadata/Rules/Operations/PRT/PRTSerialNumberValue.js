import Logger from '../../Log/Logger';
export default function PRTSerialNumberValue(pageClientAPI) {
        let serialPartNumber = '-';
        let entitySet = pageClientAPI.binding.PRTEquipment['@odata.editLink'] + '/SerialNumber';
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(function(result) {
            if (result.getItem(0)) {
              serialPartNumber = result.getItem(0).SerialNumber;
            }
            return serialPartNumber;
        }).catch(() => {
            Logger.error(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'SerialNumber read fail. PRTEquipment does not have SerialNumber nav link');
            return serialPartNumber;
        });
}
