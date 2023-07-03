export default function NotificationDetailsEquipmentListFormat(context) {
    var property = context.getProperty();
    var binding = context.getPageProxy().binding.HeaderEquipment;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${binding}')`, [], '$select=EquipDesc,EquipId,TechnicalID,Manufacturer,ModelNum,ObjectStatus_Nav/SystemStatus_Nav/StatusText&$expand=ObjectStatus_Nav/SystemStatus_Nav').then(function(data) {
        if (data && (binding = data.getItem(0))) {
            switch (property) {
                case 'Title':
                    return binding.EquipDesc + ' (' + binding.EquipId + ')';
                case 'Subhead':
                    return binding.Manufacturer + ' - ' + binding.ModelNum;
                case 'StatusText': 
                    return binding.ObjectStatus_Nav.SystemStatus_Nav.StatusText;
                case 'AccessoryType':
                    return 'disclosureIndicator';
                case 'Description': 
                    return context.localizeText('tech_id') + ': ' + binding.TechnicalID;
                default:
                    return '';
            }
        } else {
            switch (property) {
                case 'Title':
                    return context.localizeText('no_equipment_available');
                default:
                    return '';
            }
        }
    });
}
