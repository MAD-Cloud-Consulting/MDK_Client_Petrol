
function formatAddress(addressData) {
    // Name, HouseNum, Street, City, Region, Country, RoomNum, Building, Floor, CountryVersionFlag, PostalCode
    return addressData.HouseNum + ' ' + addressData.Street + ' ' + addressData.City + ' ' + addressData.Country + ' ' + addressData.PostalCode;
}

/**
 * Gets the Address/Location for a stop
 * @param {Context} context generic context used for read operations
 * @param {String} address addressNum value
 * @param {String} stopLoc stop Location value
 */
function getStopLocationName(context, address, stopLoc) {
    let addressPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `Addresses('${address}')`, [], '');
    return Promise.all([addressPromise]).then(function(resultsArray) {
        // Address Data
        let addressData = resultsArray[0] && resultsArray[0].getItem(0) ? resultsArray[0].getItem(0) : null;
        if (addressData && addressData.AddressNum) {
            return formatAddress(addressData);
        } else {
            return context.localizeText('no_location_available');
        }
    }).catch(() => {

        let flocPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${stopLoc}')`, [], '');
        return Promise.all([flocPromise]).then(function(resultsArray) {
            // FLOC Data
            let flocData = resultsArray[0] && resultsArray[0].getItem(0) ? resultsArray[0].getItem(0) : null;
            if (flocData && flocData.FuncLocDesc) {
                // Return FLOC Id  and Description
                return stopLoc + ' - ' + flocData.FuncLocDesc;
            } else {
                return context.localizeText('no_location_available');
            }
        }).catch(() => {

            let equipPromise = context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${stopLoc}')`, [], '');
            return Promise.all([equipPromise]).then(function(resultsArray) {
                // Equip Data
                let equipData = resultsArray[0] && resultsArray[0].getItem(0) ? resultsArray[0].getItem(0) : null;
                if (equipData && equipData.EquipDesc) {
                    // Return Equipment ID and Description
                    return stopLoc + ' - ' + equipData.EquipDesc;
                } else {
                    return context.localizeText('no_location_available');
                }
            }).catch(() => {
                return context.localizeText('no_location_available');
            });
        });
    });
}

export default function GetStopLocationInformation(context) {

    let locPromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '');
    return locPromise.then(function(locData) {
        if (locData && locData.getItem(0)) {
            return getStopLocationName(context, locData.getItem(0).AddressNum, locData.getItem(0).StopLocation);
        } else {
            return context.localizeText('no_location_available');
        }
    });

}
