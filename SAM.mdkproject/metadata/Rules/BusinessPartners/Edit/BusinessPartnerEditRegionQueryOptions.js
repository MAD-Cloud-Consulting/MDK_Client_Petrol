import libCom from '../../Common/Library/CommonLibrary';
import BusinessPartnerCountry from '../BusinessPartnerCountry';

export default function BusinessPartnerEditRegionQueryOptions(context) {

        // Get the page context
        let pageProxy = context.getPageProxy();

        let countryPicker = libCom.getControlProxy(pageProxy, 'Country');
        let selection = '';
        if (countryPicker === null) {
            // Picker has not been drawn yet
            selection = BusinessPartnerCountry(context);
        } else if (countryPicker.getValue().length > 0) {
            selection = countryPicker.getValue()[0].ReturnValue;
        }    

        if (selection.length > 0) {

            context.setEditable(true);
            return `$filter=Country eq '${selection}'&$orderby=Description`;
        }
        // Nothing is selected
        // Set the control to not be editable
        context.setEditable(false);
        return '$filter=Country ne null';
}
