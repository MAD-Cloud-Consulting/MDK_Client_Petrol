import libCom from '../Common/Library/CommonLibrary';
import AddressesUtil from './Utils/AddressesUtil';

export default function AddressMapValue(context) {
    let binding = context.binding;
    if (binding['@odata.type'] !== '#sap_mobile.MyWorkOrderHeader') {
        binding = context.currentPage.context.binding;
    }
    context.binding.address = binding.Address;

    if (binding.WOGeometries && binding.WOGeometries.length) {
        let geometry = binding.WOGeometries[0].Geometry.GeometryValue;
        return Promise.resolve(AddressesUtil.checkGeometryValue(geometry));
    } else if (binding.WOGeometries && binding.WOGeometries.Geometry) {
        let geometry = binding.WOGeometries.Geometry.GeometryValue;
        return Promise.resolve(AddressesUtil.checkGeometryValue(geometry));
    }

    let sequences = libCom.getStateVariable(context, 'sequences');
    libCom.setStateVariable(context, 'sequences', []);
    if (sequences && sequences.length) {
        let address = AddressesUtil.filterAddressesBySequences(sequences, binding);
        return address ? address.geometry : '';
    } else {
        let orderType = binding.OrderType;
        let queryOptions = `$filter=PMObjectType eq '${orderType}'&$orderby=SequenceNo asc`;
    
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'AddressDetSequences', [], queryOptions).then(function(values) {
            let address = AddressesUtil.filterAddressesBySequences(values, binding);
            return address ? address.geometry : '';
        });    
    }
}
