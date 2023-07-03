export default function MeterReadingUpdateCaption(pageProxy) {
    let finished = Promise.resolve();
    if (pageProxy.binding.FromSingleRegister) {
        pageProxy.setCaption(pageProxy.localizeText('take_reading'));
    } else {
        let takeReadingText = pageProxy.localizeText('take_readings');
        try {
            let extension = pageProxy.getControl('FormCellContainer')._control;
            let allCellsArray = extension.cells;

            //collect all of the ReadingValue fields
            let readingFieldsArray = allCellsArray.filter(cell => {
                return cell.controlProxy.getName().includes('ReadingValue'); 
            });

            //collect the ones that have values entered
            let readingFieldsWithValuesArray = readingFieldsArray.filter(readingField => {
                let readingValue = readingField.controlProxy.getValue();
                if (readingValue !== undefined) { //We need to check for undefined specifically instead of a truthy check because a value of 0 is a valid reading, but will return false during the truthy check
                    return readingValue.toString().length > 0;
                } else {
                    return false;
                }
            });

            let countString = `${readingFieldsWithValuesArray.length} of ${readingFieldsArray.length}`;

            pageProxy.setCaption(`${takeReadingText} (${countString})`);
        } catch (exc) {
            let registers;
            let regCount;
            if (pageProxy.binding.Device_Nav) {
                // If page has not been set up yet, this will be called
                registers = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.Device_Nav['@odata.readLink'] + '/MeterReadings_Nav', '$filter=sap.islocal()');
                regCount = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.Device_Nav.RegisterGroup_Nav['@odata.readLink'] + '/Registers_Nav', '');
            } else {
                // If page has not been set up yet, this will be called
                registers = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.DeviceLink['@odata.readLink'] + '/MeterReadings_Nav', '$filter=sap.islocal()');
                regCount = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.DeviceLink.RegisterGroup_Nav['@odata.readLink'] + '/Registers_Nav', '');
            }

            finished = Promise.all([registers, regCount]).then(function(results) {
                pageProxy.setCaption(`${takeReadingText} (${results[0]} of ${results[1]})`);
            });
            
        }

        return finished;
    }
}
