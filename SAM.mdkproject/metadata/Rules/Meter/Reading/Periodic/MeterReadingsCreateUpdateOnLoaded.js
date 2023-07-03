import ODataDate from '../../../Common/Date/ODataDate';
import Stylizer from '../../../Common/Style/Stylizer';

export default function MeterReadingsCreateUpdateOnLoaded(context) {
    //Style
    let stylizer = new Stylizer(['GrayText']);

    let registerNum = context.getControl('RegisterNum');
    if (registerNum) {
        stylizer.apply(registerNum, 'Value');
    }

    var deviceBinding = context.binding.pageBinding;
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
    let discardButton = context.getControl('DiscardButton');
    discardButton.setVisible(Boolean(context.binding['@sap.hasPendingChanges']));

    return context.read('/SAPAssetManager/Services/AssetManager.service', deviceBinding['@odata.readLink'], [], '$expand=MeterReadings_Nav').then(function(result) {
        if (result && result.length === 1) {
            let localReadings = result.getItem(0).MeterReadings_Nav;
            if (localReadings && localReadings.length > 0) {
                let localReading = localReadings.find((value) => {
                    return value.Register === context.binding.RegisterNum;
                });
                if (localReading) {
                    context.binding.MeterReadingRecorded = localReading.MeterReadingRecorded;
                    context.binding.UsagePeakTimeBool = (localReading.DateMaxRead !== null);
                    context.binding.MeterReaderNote = localReading.MeterReaderNote;
                    context.binding.MeterReadingDate = new ODataDate(localReading.MeterReadingDate, localReading.MeterReadingTime).toLocalDateString();

                    if (context.binding.UsagePeakTimeBool) {
                        context.binding.DateMaxRead = new ODataDate(localReading.DateMaxRead, localReading.TimeMaxReading).toLocalDateString();
                    }

                    let readingValueControlProxy = context.getControl('ReadingValue');
                    let peakTimeSwitchControlProxy = context.getControl('PeakTimeSwitch');
                    let peakTimeControlProxy = context.getControl('PeakUsageTimeControl');
                    let readingTimeControlProxy = context.getControl('ReadingTimeControl');
                    let notePickerControlProxy = context.getControl('NotePicker');

                    readingValueControlProxy.setValue(context.binding.MeterReadingRecorded);
                    peakTimeSwitchControlProxy.setValue(context.binding.UsagePeakTimeBool);
                    peakTimeControlProxy.setValue(context.binding.DateMaxRead);
                    readingTimeControlProxy.setValue(context.binding.MeterReadingDate);
                    notePickerControlProxy.setValue(context.binding.MeterReaderNote);

                    peakTimeControlProxy.setVisible(context.binding.UsagePeakTimeBool);

                    context.binding.MeterReadingReadLink = localReading['@odata.readLink'];
                }
            }
        }
    });
}
