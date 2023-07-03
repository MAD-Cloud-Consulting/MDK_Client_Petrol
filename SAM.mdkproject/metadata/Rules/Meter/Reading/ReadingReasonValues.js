export default function ReadingReasonValues(context) {
    let queryOpts = '';
    if (context.getPageProxy().binding.Installation !== '') {
        queryOpts = "$filter=TechInstallationFlag eq ''&$orderby=MeterReadingReason";
    } else {
        queryOpts = "$filter=TechInstallationFlag eq 'X'&$orderby=MeterReadingReason";
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingReasons', [], queryOpts).then(function(results) {
        let pickerValues = [];

        for (let idx = 0; idx < results.length; idx ++) {
            let entry = results.getItem(idx);
            pickerValues.push({'DisplayValue' : `${entry.MeterReadingReason} - ${entry.Description}`, 'ReturnValue': entry.MeterReadingReason});
        }

        return pickerValues;
    });
}
