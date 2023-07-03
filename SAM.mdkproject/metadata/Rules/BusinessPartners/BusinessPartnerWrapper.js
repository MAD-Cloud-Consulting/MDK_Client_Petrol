import libVal from '../Common/Library/ValidationLibrary';
import {ValueIfExists} from '../Common/Library/Formatter';

export class BusinessPartnerWrapper {

    constructor(entity) {
        this.entity = entity;
        this.partnerType = entity.PartnerFunction_Nav.PartnerType;
    }

    communicationsPropertyMap() {
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return {
                    'Email': ['CommType', 'E', 'EMail'],
                    'Fax': ['CommType', 'F', 'TelNumberLong'],
                    'Mobile': ['CommType', 'M', 'TelNumberLong'],
                    'Telephone': ['CommType', 'T', 'TelNumberLong'],
                    'CallableTelephone': ['CommType', 'T', 'TelNumberLong'],
                    'Extension': ['CommType', 'T', 'TelExtension'],
                    'MobileShort': ['CommType', 'M', 'TelNumber'],
                    'TelephoneShort': ['CommType', 'T', 'TelNumber'],
                    'FaxShort': ['CommType', 'F', 'TelNumber'],
                    'FaxExtension': ['CommType', 'F', 'TelExtension'],
                };
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return {
                    'Email': ['CommunicationType', '0010', 'Value'],
                    'Fax': ['CommunicationType', '0005', 'Value'],
                    'Mobile': ['CommunicationType', 'CELL', 'Value'],
                    'Telephone': ['CommunicationType', '0020', 'Value'],
                    'CallableTelephone': ['CommunicationType', '0020', 'Value'],
                };
            default:
                // Throw unrecognized entity error?
                break;
        }
        return null;
    }

    nameEntity() {
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                return this.entity.Address_Nav;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return this.entity.AddressAtWork_Nav;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return this.entity.Employee_Nav;
            default:
                // Throw unrecognized entity error?
                break;
        }
        return null;
    }

    addressEntity() {
        let addressEntity;
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                addressEntity = this.entity.Address_Nav;
                break;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                addressEntity = this.entity.AddressAtWork_Nav;
                break;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                // Temp workaround
                /*
                if (this.entity.Employee_Nav.EmployeeAddress_Nav[0] && this.entity.Employee_Nav.EmployeeAddress_Nav[0].AddressType === '1') {
                    addressEntity = this.entity.Employee_Nav.EmployeeAddress_Nav[0];
                }
                */
               addressEntity = null;
                break;
            default:
                // Throw unrecognized entity error?
                break;
        }
        if (addressEntity === undefined) {
            return null;
        }
        return addressEntity;
    }

    communicationSet() {
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
                return this.entity.Address_Nav.AddressCommunication;
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return this.entity.AddressAtWork_Nav.AddressAtWorkComm;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return [];
                // return this.entity.Employee_Nav.EmployeeCommunications_Nav;
            default:
                // Throw unrecognized entity error?
                break;
        }
        return null;
    }

    nameProperty(property) {
        // determine property key
        let propertyMap = {
            'Name': 'Name',
            'First': 'FirstName',
            'Last': 'LastName',
        };
        let key = propertyMap[property];
        return this.nameEntity()[key];
    }

    addressProperty(property) {
        // determine property key
        let propertyMap = {
            'Street': 'Street',
            'City': 'City',
            'PostalCode': 'PostalCode',
            'Country': 'Country',
            'Building': 'Building',
            'Floor': 'Floor',
            'Room': 'RoomNum',
        };
        if (propertyMap[property] === undefined) {
            // Empty key, must be a unique one
            switch (this.partnerType) {
                case 'LI':
                case 'KU': //For vendor and customer, the address info is in the 
                case 'AP':
                case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                    propertyMap = {
                        'Region': 'Region',
                        'House': 'HouseNum',
                        'PersonNum': 'PersonNum',
                    };
                    break;
                case 'PE': //For Employee, the Employee_Nav EntitySet
                    propertyMap = {
                        'Region': 'District',
                        'PersonNum': 'PersonnelNum',
                    };
                    break;
                default:
                    // Throw unrecognized entity error?
                    return null;
            }
        }

        let key = propertyMap[property];
        let addressEntity = this.addressEntity();
        if (key === undefined || addressEntity === null) {
            return null;
        }
        return addressEntity[key];
    }

    communicationElement(property, propertyMap = this.communicationsPropertyMap()) {
        if (propertyMap === null) {
            return null;
        }

        let commSet = this.communicationSet();
        let propertySet = propertyMap[property];
        if (libVal.evalIsEmpty(propertySet)) {
            return null;
        }

        // Find the element with the defined property map type
        let element = commSet.find(_element => {
            return _element[propertySet[0]] === propertySet[1];
        });
        // If unfound, return null
        if (element === undefined) {
            return null;
        }
        return element;
    }

    /**
     * Retrieve a communication property from the business partner
     * @param {*} property 
     */
    communicationProperty(property) {

        // Fetch the relevant property map
        let propertyMap = this.communicationsPropertyMap();
        let element = this.communicationElement(property, propertyMap);
        if (element === null) {
            return null;
        }
        // Return the mapped property key value
        return element[propertyMap[property][2]];
    }

    name() {
        // Retrieve the complex name
        let name = this.nameProperty('Name');
        if (libVal.evalIsEmpty(name)) {
            // TODO: localize
            name = this.nameProperty('First') + ' ' + this.nameProperty('Last');
        }
        return name;
    }

    address() {
        let parts = [];

        /// First line: houseNumber street
        let line1 = [];
        let house = this.addressProperty('House');
        let street = this.addressProperty('Street');

        if (!libVal.evalIsEmpty(house)) {
            line1.push(house);
            if (!libVal.evalIsEmpty(street)) line1.push(' ');
        }
        if (!libVal.evalIsEmpty(street)) line1.push(street);

        if (line1.length > 0) {
            parts.push(line1.join(''));
        }

        /// Second line: City, region zip
        let line2 = [];
        let city = this.addressProperty('City');
        let region = this.addressProperty('Region');
        let zip = this.addressProperty('PostalCode');

        if (!libVal.evalIsEmpty(city)) {
            line2.push(city);
            if (!libVal.evalIsEmpty(region) || !libVal.evalIsEmpty(zip)) {
                line2.push(', ');
            }
        } 
        if (!libVal.evalIsEmpty(region)) {
            line2.push(region);
            line2.push(' ');
        }
        if (!libVal.evalIsEmpty(zip)) line2.push(zip);

        if (line2.length > 0) {
            parts.push(line2.join(''));
        }
        // Push the country directly into the parts list
        let country = this.addressProperty('Country');
        if (!libVal.evalIsEmpty(country)) parts.push(country);

        // Return the parts joined by new lines
        return parts.join('\n');
    }

    office(context) {
        let building = this.addressProperty('Building');
        if (!libVal.evalIsEmpty(building)) {
            let parts = [];
            let bldg = context.localizeText('building');
            parts.push(`${bldg} ${building}`);
            let floor = this.addressProperty('Floor');
            if (floor !== null) {
                let flr = context.localizeText('floor');
                parts.push(`${flr} ${floor}`);
            }

            let room = this.addressProperty('Room');
            if (room !== null) {
                let rm = context.localizeText('room');
                parts.push(`${rm} ${room}`);
            }
            // TODO: localize
            return parts.join('\n');
        }
        return '';
    }

    personNumber() {

        let entity = this.nameEntity();
        switch (this.partnerType) {
            case 'LI':
            case 'KU': //For vendor and customer, the address info is in the Address_Nav EntitySet
            case 'AP':
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return entity.PersonNum;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return entity.PersonnelNumber;
            default:
                // Throw unrecognized entity error?
                break;
        }
        // Throw unrecognized error?
        return null;
    }

    addressNumber() {
        let addressEnity = this.addressEntity();
        if (addressEnity) {
            return addressEnity.AddressNum;
        } 

        return null;
    }

    partnerDetails() {
        let partnerFunctionDetails =
        {
            'PartnerFunction': ValueIfExists(this.entity.PartnerFunction_Nav.PartnerFunction),
            'PartnerType': ValueIfExists(this.entity.PartnerFunction_Nav.PartnerType),
            'Description': ValueIfExists(this.entity.PartnerFunction_Nav.Description),
        };
        return partnerFunctionDetails;
    }    
       
}
