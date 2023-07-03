import {BusinessPartnerWrapper} from '../BusinessPartnerWrapper';
import {BusinessPartnerEditExpandPropAction} from './BusinessPartnerEditExpandPropAction';


/**
 * Wraps an editable object
 * 
 * Convenience for retieving edit actions
 */
export class BusinessPartnerEditWrapper extends BusinessPartnerWrapper {


    /**
     * Returns a touple consisting of the Edit action as well as necessary client data
     */
    editAddressActionData() {

        let clientData = {};
        let action;

        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                clientData.addressEntity = 'Addresses';
                action = '/SAPAssetManager/Actions/BusinessPartners/Address/BusinessPartnersEditAddress.action';
                break;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                clientData.addressEntity = 'AddressesAtWork';
                action = '/SAPAssetManager/Actions/BusinessPartners/Address/BusinessPartnersEditAddress.action';
                break;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                action = '/SAPAssetManager/Actions/BusinessPartners/Address/BusinessPartnersEditEmployeeAddress.action';
                break;
            default:
                // TODO: throw an error ?
                return null;
        }

        let entity = this.addressEntity();
        clientData.addressReadLink = entity['@odata.editLink'];

        return [action, clientData];
    }

    editAddressAction() {
        let actionData = this.editAddressActionData();
        let args = {
            'name': 'BusinessPartnerEditAddressAction',
            'action': actionData[0],
            'clientDataInfo': actionData[1],
        };

        return new BusinessPartnerEditExpandPropAction(args);
    }

    editCommPropertyActionData(property) {
        // Retrieve the element for the communication prop element
        let entity = super.communicationElement(property);
        
        let clientData = {};
        let action;

        // True if we are uploading an email.
        // Otherwise, we assume a phone number of some sort

        if (entity != null) {
            switch (this.partnerType) {
                case 'LI':
                case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                    clientData.addressComm = 'AddressCommunications';
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersEditAddressComm.action';
                    break;
                case 'AP':
                case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                    clientData.addressComm = 'AddressesAtWorkComm';
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersEditAddressComm.action';
                    break;
                case 'PE': //For Employee, the Employee_Nav EntitySet
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersEditEmployeeComm.action';
                    break;
                default:
                    // TODO: throw an error ?
                    return null;
            }
            // This is an update action. Make sure to include the readlink in client data
            clientData.commPropertyReadLink = entity['@odata.readLink'];
        } else {
            switch (this.partnerType) {
                case 'LI':
                case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                    clientData.addressComm = 'AddressCommunications';
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersCreateAddressComm.action';
                    break;
                case 'AP':
                case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                    clientData.addressComm = 'AddressesAtWorkComm';
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersCreateAddressComm.action';
                    break;
                case 'PE': //For Employee, the Employee_Nav EntitySet
                    action = '/SAPAssetManager/Actions/BusinessPartners/Communication/BusinessPartnersCreateEmployeeComm.action';
                    break;
                default:
                    // TODO: throw an error ?
                    return null;
            }

            // Set the communication type
            clientData.commType = this.communicationsPropertyMap()[property][1];
            clientData.personelNum = this.personNumber();
            clientData.addressNum = this.addressNumber();
            clientData.communicationLinks = this.communicationPropertyLinks();
            clientData.communicationsSetReadLink = this.communicationSetReadLink();

        }

        return [action, clientData];
    }


    /**
     * Create an action for updating the email
     * @param {*} value 
     */
    editEmailAction(value) {

        let actionData = this.editCommPropertyActionData('Email', value);
        let clientDataInfo = actionData[1];
        let args = {
            'name': 'BusinessPartnerEditEmailAction',
            'action': actionData[0],
        };

        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet                
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                clientDataInfo.email = value;
                // Add emptry strings to make sure resident client data values are gone
                clientDataInfo.telNumber = '';
                clientDataInfo.telNumberCall = '';
                clientDataInfo.telNumberLong = '';
                clientDataInfo.telNumberExt = '';

                break;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                clientDataInfo.value = value;
                break;
            default:
                // TODO: throw an error ?
                return null;
        }

        args.clientDataInfo = clientDataInfo;

        return new BusinessPartnerEditExpandPropAction(args);
    }


    /**
     * 
     * @param {*} value - Raw control valus as input by the user
     * @param {*} type - one of Fax, Phone, Mobile
     */
    editPhoneNumberAction(value, type, code = '', extension='') {

        let actionData = this.editCommPropertyActionData(type, value);
        let clientDataInfo = actionData[1];
        let args = {
            'name': 'BusinessPartnerEdit' + type + 'Action',
            'action': actionData[0],
        };

        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet                
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                // Set empty string to make sure stale values from email action are gone
                clientDataInfo.email = '';
                // Setup the client data for the values to update this to                
                clientDataInfo.telNumber = value;
                clientDataInfo.telNumberCall = this.callablePhoneNumber(value);
                clientDataInfo.telNumberLong = code.concat(value.concat(extension));
                clientDataInfo.telNumberExt = extension;
                break;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                clientDataInfo.value = value;
                break;
            default:
                // TODO: throw an error ?
                return null;
        }

        args.clientDataInfo = clientDataInfo;

        return new BusinessPartnerEditExpandPropAction(args);
    }

    /**
     * Convert a string to alphanumeric
     * @param {String} value 
     */
    alphanumeric(value) {
        // Strips out all non alpha-numeric characters
        return value.replace(/[^A-Za-z0-9]+/g, '');
    }

    callablePhoneNumber(value) {
        let chars = [];
        if (value.charAt(0) === '+') {
            // If there is a country code, make sure it is not pruned
            chars.push('+');
        }
        let alphanumeric = this.alphanumeric(value);
        
        for (let i =0; i< alphanumeric.length; i++) {
            let charCode = alphanumeric.charCodeAt(i);
            if (charCode > 47 && charCode < 58) {
                chars.push(alphanumeric.charAt(i));
            } else {
                // Assume this is in a character range
                if (charCode > 96) {
                    // This is lower case, convert it to Upper case
                    charCode -= 32;
                }
                // Determine the equivalent char val
                // 65-67 = 2 -> 50
                // 68-70 = 3 -> 51
                // 71-73 = 4 -> 52
                // 74-76 = 5 -> 53
                // 77-79 = 6 -> 54
                // 80-83 = 7 -> 55
                // 84-86 = 8 -> 56
                // 87-90 = 9 -> 57

                // Make all of these ranges divisible by 3
                if (charCode > 82) charCode -= 1;
                if (charCode > 86) charCode -= 1;
                // Now we can consider this:
                // 80-82 = 7 -> 55
                // 83-85 = 8 -> 56
                // 86-89 = 9 -> 57

                // Zero out the value and divide by 3
                charCode = Math.floor((charCode - 65) / 3);
                chars.push(String.fromCharCode(50 + charCode)); 
            }
        }
        return chars.join('');
    }

    /**
     * Generate links to entities needed by Communication properties
     */
    communicationPropertyLinks() {

        let addressEntity = this.nameEntity();
        if (addressEntity === null) {
            return [];
        }

        let readlink = addressEntity['@odata.readLink'];
        // Extact the entity type from it
        let entitySet  = readlink.split('(')[0];
        let navProperty;
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                navProperty = 'Address';
                break;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                navProperty = 'AddressAtWork';
                break;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                navProperty = 'Employee_Nav';
                break;
            default:
                navProperty = '';
                break;
        }

        return [{
            'Property': navProperty,
            'Target': {
                'EntitySet': entitySet,
                'ReadLink': readlink,
            },
        }];
    }



    /**
     * Retrieve a read link which will resolve to all communication expanded properties
     */
    communicationSetReadLink() {
        let addressEntity = this.addressEntity();
        if (addressEntity === null) {
            return '';
        }

        let readlink = addressEntity['@odata.readLink'];
        // Extact the entity type from it
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                return `${readlink}/Address`;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return `${readlink}/AddressAtWork`;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return `${readlink}/EmployeeCommunications_Nav`;
            default:
                break;
        }

        return '';
    }

}

