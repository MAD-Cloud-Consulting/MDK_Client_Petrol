
export default class AddressesUtil {
    static filterAddressesBySequences(sequences, item) {
        let geometry = '';

        sequences.some(sequence => {
            let addressSrc = sequence.SrcObjectTechEntityType;
            let addressObj = sequence.SrcObjectType;

            if (addressSrc === 'WOPARTNER') {
                let partners = item.WOPartners;
                let findPartner = partners.find(partner => {
                    return partner.PartnerFunction === addressObj && this._checkAddressGeometryExist(partner.Address_Nav);
                });

                if (findPartner) {
                    geometry = findPartner.Address_Nav.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                    item.address = findPartner.Address_Nav;
                }
            } else {
                if (addressSrc === 'WOHEADER' && this._checkAddressGeometryExist(item.Address)) {
                    geometry = item.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                    item.address = item.Address;
                } else if (item.Equipment && this._checkAddressGeometryExist(item.Equipment.Address)) {
                    geometry = item.Equipment.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                    item.address = item.Equipment.Address;
                }
            }

            if (geometry) {
                return true;
            }

            return false;
        });
    
        item.geometry = this.checkGeometryValue(geometry);

        return item;
    }

    static _checkAddressGeometryExist(address) {
        return address && address.AddressGeocode_Nav && address.AddressGeocode_Nav.Geometry_Nav 
            && address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;        
    }

    static checkGeometryValue(geometry) {
        if (geometry && !geometry.includes('"x":,') && !geometry.includes('"y":,')) {
            return geometry;
        }

        return '';
    }    
}
