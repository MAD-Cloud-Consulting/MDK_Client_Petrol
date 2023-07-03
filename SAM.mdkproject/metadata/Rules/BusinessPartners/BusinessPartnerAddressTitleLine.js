import businessPartnerEntitySet from './BusinessPartnerEntitySet';
import libCommon from '../Common/Library/CommonLibrary';

export default function BusinessPartnerAddressTitleLine(context) {
    if (context.binding && context.binding.Address_Nav) {
        return Promise.resolve(libCommon.oneLineAddress(context.binding.Address_Nav));
    }
    let partnerFunction = 'SP';
    let queryOptions = '$filter=PartnerFunction eq \'' + partnerFunction + '\'&$expand=Address_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', businessPartnerEntitySet(context), [], queryOptions).then(function(result) {
        if (libCommon.isDefined(result.getItem(0)) && libCommon.isDefined(result.getItem(0).Address_Nav)) {
            let address = result.getItem(0).Address_Nav;
            return libCommon.oneLineAddress(address);
        } else {
            return context.localizeText('no_address_available');
        }
    }).catch(function() {
        return context.localizeText('no_address_available');
    });
}
