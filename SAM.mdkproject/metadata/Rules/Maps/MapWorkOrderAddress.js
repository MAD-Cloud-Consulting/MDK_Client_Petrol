import libCommon from '../Common/Library/CommonLibrary';
import AddressMapValue from './AddressMapValue';

export default function MapWorkOrderAddress(context) {
    let address = context.binding.address;
    
    if (address) {
        return libCommon.oneLineAddress(address);
    } else {
        return AddressMapValue(context).then(()=> {
            address = context.binding.address;
    
            if (address) {
                return libCommon.oneLineAddress(address);
            } else {
                return context.localizeText('no_address_available');
            }
        });
    }
}
