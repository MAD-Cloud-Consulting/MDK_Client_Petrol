import ODataDate from '../../Common/Date/ODataDate';
import Stylizer from '../../Common/Style/Stylizer';
import common from '../../Common/Library/CommonLibrary';

export default function MeterReadingsCreateUpdateOnLoaded(context) {
    //Style
    let stylizer = new Stylizer(['GrayText']);

    let registerNum = context.getControl('RegisterNum');
    if (registerNum) {
        stylizer.apply(registerNum, 'Value');
    }

    if (common.getStateVariable(context, 'METERREADINGOBJ')) {
        context.binding.pageBinding = common.getStateVariable(context, 'METERREADINGOBJ');
    }

    var deviceBinding = {};
    if (context.binding.pageBinding.DeviceLink) {
        deviceBinding = context.binding.pageBinding.DeviceLink;
    } else if (context.binding.pageBinding.Device_Nav) {
        deviceBinding = context.binding.pageBinding.Device_Nav;
    }

    context.binding.DeviceLink = deviceBinding;

    let meterReadingDocID = String(new Date().getTime()) + '_' + context.binding.RegisterNum;
    context.binding.DocID = 'LOCAL_' + meterReadingDocID.substring(meterReadingDocID.length - 10);

    if (context.binding.pageBinding.BatchEquipmentNum) {
        context.binding.BatchEquipmentNum = context.binding.pageBinding.BatchEquipmentNum;
    } else {
        context.binding.BatchEquipmentNum = context.binding.pageBinding.EquipmentNum;
    }
    context.binding.OrderISULink = context.binding.pageBinding;

    return context.read('/SAPAssetManager/Services/AssetManager.service', deviceBinding['@odata.readLink'] + '/MeterReadings_Nav', [], `$filter=sap.islocal() and Register eq '${context.binding.RegisterNum}'&orderby=MeterReadingDate`).then(function(result) {
        if (result && result.length > 0) {
            let localReading = result.getItem(0);
            context.binding.MeterReadingRecorded = localReading.MeterReadingRecorded;
            context.binding.UsagePeakTimeBool = (localReading.DateMaxRead !== null);
            context.binding.MeterReaderNote = localReading.MeterReaderNote;

            let dateTime = new ODataDate(localReading.MeterReadingDate, localReading.MeterReadingTime);
            let dateMaxRead = localReading.DateMaxRead ? 
                    new ODataDate(localReading.DateMaxRead, localReading.TimeMaxReading) :
                    dateTime;

            context.binding.MeterReadingDate = dateTime.toLocalDateString();

            if (context.binding.UsagePeakTimeBool) {
                context.binding.DateMaxRead = dateMaxRead.toLocalDateString();
            }

            let readingValueControlProxy = context.getControl('ReadingValue');
            let peakTimeSwitchControlProxy = context.getControl('PeakTimeSwitch');
            let peakTimeControlProxy = context.getControl('PeakUsageTimeControl');
            let readingTimeControlProxy = context.getControl('ReadingTimeControl');
            let notePickerControlProxy = context.getControl('NotePicker');
            let discardButton = context.getControl('DiscardButton');

            readingValueControlProxy.setValue(context.binding.MeterReadingRecorded);
            peakTimeSwitchControlProxy.setValue(context.binding.UsagePeakTimeBool);
            peakTimeControlProxy.setValue(new Date(dateMaxRead._date - (common.getBackendOffsetFromSystemProperty(context) * 1000 * 3600 + new Date().getTimezoneOffset() * 60 * 1000)));
            readingTimeControlProxy.setValue(new Date(dateTime._date - (common.getBackendOffsetFromSystemProperty(context) * 1000 * 3600 + new Date().getTimezoneOffset() * 60 * 1000)));
            notePickerControlProxy.setValue(context.binding.MeterReaderNote);

            peakTimeControlProxy.setVisible(context.binding.UsagePeakTimeBool);
            discardButton.setVisible(Boolean(context.binding['@odata.editLink']));

            // context.binding.DeviceMeterReadingReadLink = localReading['@odata.readLink'];
            context.binding.MeterReadingReadLink = localReading['@odata.readLink'];
        }
    });
}
