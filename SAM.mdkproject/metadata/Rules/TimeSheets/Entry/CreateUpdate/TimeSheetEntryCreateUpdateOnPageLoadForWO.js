import libCommon from '../../../Common/Library/CommonLibrary';
import minutesDefault from './TimeSheetEntryMinuteInterval';
import minutesDefaultDecimal from './TimeSheetEntryMinuteIntervalDecimal';
import libClock from '../../../ClockInClockOut/ClockInClockOutLibrary';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';

export default function TimeSheetEntryCreateUpdateOnPageLoadForWO(context) {
    libCommon.saveInitialValues(context);
    let title = context.localizeText('add_time');
    context.setCaption(title);
    var startDate = libCommon.getStateVariable(context, 'StatusStartDate');
    var endDate = libCommon.getStateVariable(context, 'StatusEndDate');
    let durationControl = context.getControl('FormCellContainer').getControl('DurationPkr');
    var elapsed = (endDate - startDate) / 3600000.0;

    let woControl = context.getControl('FormCellContainer').getControl('RecOrderLstPkr');
    let oprControl = context.getControl('FormCellContainer').getControl('OperationLstPkr');
    let subOprControl = context.getControl('FormCellContainer').getControl('SubOperationLstPkr');
    let workCenterControl = context.getControl('FormCellContainer').getControl('WorkCenterLstPkr');

    let objects = getContextObjects(context);

    setListPickerValue(workCenterControl, objects.workCenter);
    setListPickerValue(woControl, objects.woReadLink);
    setListPickerValue(oprControl, objects.opReadLink);
    setListPickerValue(subOprControl, objects.subOpReadLink);

    return libClock.getElapsedClockTime(context, objects.orderId, objects.operationNo, objects.subOperationNo).then((clockTime) => {
        if (clockTime > 0) {
            elapsed = clockTime; //Clock In/Out records were found for this business object
        }
        // small number to determine if enough time has passed to set control
        var epsilon = 1 / 7200;
        // Time interval to be used in Duration picker.
        // Set duration to time rounded to closest interval in minutes expressed in Hours
        let interval = minutesDefault(context);
        const defaultDecimal = minutesDefaultDecimal(context);
        let time = defaultDecimal;
        if (elapsed > epsilon) {
            elapsed = (interval / 60) * (Math.round(60 * elapsed/interval));
            if (elapsed > defaultDecimal) {
                time = elapsed;
            } else {
                time = defaultDecimal;
            }
        }
        context.getClientData().timeSheetInitialDuration = 0;
        let warningAccumulatedHoursPromise = Promise.resolve();

        if (time > (24 - defaultDecimal)) { //Maximum the screen control can handle
            context.getClientData().timeSheetInitialDuration = time; //Store the initial time value for validation later
            time = 24 - defaultDecimal;
            let dynamicParams = [Math.round(100 * time) / 100];
            warningAccumulatedHoursPromise = context.executeAction({ // show warning that accumulated time exceeds 24 hours and user has to resolve that manually
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'Title': context.localizeText('validation_warning'),
                    'Message': context.localizeText('time_exceeds_24_hours', dynamicParams),
                    'OKCaption': context.localizeText('ok'),
                },
            });
        }
        durationControl.setValue(time);

        let binding = context.getBindingObject();
        return libTS.updateWorkCenter(context, binding.WorkCenterInternalId).then(() => {
            if (!context.getClientData().LOADED) {
                context.getClientData().UPDATOR = 'NONE';
                context.getClientData().LOADED = true;
            }
    
            return warningAccumulatedHoursPromise.then(() => {
                return Promise.resolve(true);
            });
        });
    });
}

export function getContextObjects(context) {

    let binding = libCommon.getBindingObject(context);

    let result = {};
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        result.workCenter = binding.MainWorkCenter;
        result.woReadLink = binding['@odata.readLink'];
        result.orderId = binding.OrderId;
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        result.workCenter = binding.WOHeader.MainWorkCenter;
        if (binding.MainWorkCenter) { //Use operation work center if it exists
            result.workCenter = binding.MainWorkCenter;
        }
        result.woReadLink = binding.WOHeader['@odata.readLink'];
        result.opReadLink = binding['@odata.readLink'];
        result.orderId = binding.WOHeader.OrderId;
        result.operationNo = binding.OperationNo;
    } else {
        result.workCenter = binding.WorkOrderOperation.WOHeader.MainWorkCenter;
        result.woReadLink = binding.WorkOrderOperation.WOHeader['@odata.readLink'];
        result.opReadLink = binding.WorkOrderOperation['@odata.readLink'];
        result.subOpReadLink = binding['@odata.readLink'];
        context.getClientData().subOpPickerIsLocked = true;
        result.orderId = binding.WorkOrderOperation.WOHeader.OrderId;
        result.operationNo = binding.WorkOrderOperation.OperationNo;
        result.subOperationNo = binding.SubOperationNo;
    }

    return result;
}

export function setListPickerValue(control, value) {

    if (value === undefined) {
        return;
    }
    libCommon.setFormcellNonEditable(control);
    control.setValue(value);
}
