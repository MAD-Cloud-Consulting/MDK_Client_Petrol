import { TimeSheetLibrary as libTimesheet, TimeSheetEventLibrary as libTSEvent } from '../../TimeSheets/TimeSheetLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import crew from '../CrewLibrary';
import GenerateLocalID from '../../Common/GenerateLocalID';
import GetDuration from '../../Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

/**
 * Creates a Timesheet record for the indicated employee
 * @param {IClientAPI} context MDK Context
 * @param {Number} perno Personnel Number
 * @param {Number} hours Hours to add to timesheet
 * @returns {Promise<*>} Action result of time add
 */
function createTimesheet(context, perno, hours, increment) {
    const chosenDate = context.evaluateTargetPath('#Control:HourEndDtPicker/#Value');
    const odataDate = "datetime'" + new ODataDate(chosenDate).toLocalDateString() + "'";

    const woReadLink = (function() {
        try {
            return context.evaluateTargetPath('#Control:RecOrderLstPkr/#SelectedValue');
        } catch (exc) {
            return '';
        }
    })();
    const opReadLink = (function() {
        try {
            return context.evaluateTargetPath('#Control:OperationLstPkr/#SelectedValue');
        } catch (exc) {
            return '';
        }
    })();
    const subOpReadLink = (function() {
        try {
            return context.evaluateTargetPath('#Control:SubOperationLstPkr/#SelectedValue');
        } catch (exc) {
            return '';
        }
    })();

    let links = [
    {
        'Property': 'Employee',
        'Target':
        {
            'EntitySet': 'Employees',
            'QueryOptions': `$filter=PersonnelNumber eq '${perno}'`,
        },
    }];

    if (woReadLink) {
        links.push({
            'Property': 'MyWOHeader',
            'Target':
            {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': woReadLink,
            },
        });
    }
    if (opReadLink) {
        links.push({
            'Property': 'MyWOOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': opReadLink,
            },
        });
    }
    if (subOpReadLink) {
        links.push({
            'Property': 'MyWOSubOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderSubOperations',
                'ReadLink': subOpReadLink,
            },
        });
    }
    return GenerateLocalID(context, 'CatsTimesheets', 'Counter', '000000000000', '', '', undefined, increment).then(counter => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], `$filter=CrewList/OriginTimeStamp eq ${odataDate} and CrewItemType eq 'EMPLOYEE' and CrewItemKey eq '${perno}'`).then(readResult => {
            libCom.setOnCreateUpdateFlag(context, '');
            if (readResult.length === 1) {
                return context.executeAction({'Name': '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateCreate.action', //Create the timesheet record
                'Properties': {
                    'Properties': {
                        'Counter': counter,
                        'Date': '/SAPAssetManager/Rules/TimeSheets/CreateUpdate/TimeSheetCreateUpdateDate.js',
                        'Hours': '#Control:DurationPkr/#Value',
                        'AttendAbsenceType': '#Control:AbsAttLstPkr/#SelectedValue',
                        'ActivityType': '#Control:ActivityTypeLstPkr/#SelectedValue',
                        'Workcenter': '#Control:WorkCenterLstPkr/#SelectedValue',
                        'PersonnelNumber': perno,
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': counter,
                        'OfflineOData.RemoveAfterUpload': 'true',
                    },
                    'CreateLinks': links,
                    'OnSuccess' : '',
                    'OnFailure': '',
                }}).then((result) => {
                    if (IsCompleteAction(context)) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                            data: result.data,
                            link: JSON.parse(result.data)['@odata.editLink'],
                            value: ConvertDoubleToHourString(GetDuration(context)),
                        });
                    }

                    return context.executeAction({'Name': '/SAPAssetManager/Actions/Crew/CrewListItemEmployeeUpdate.action', // Update CrewListItems record
                        'Properties': {
                            'Target': {
                                'EntitySet': 'CrewListItems',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': readResult.getItem(0)['@odata.readLink'],
                            },
                            'Properties': {
                                'CatsHours': readResult.getItem(0).CatsHours + hours,
                            },
                            'Headers':
                            {
                                'OfflineOData.TransactionID': readResult.getItem(0).CrewId,
                            },
                        },
                    });
                });
            } else { //There are no crew records for this employee for this day, so add them and try again
                return crew.initializeCrewHeaderAndEmployee(context, chosenDate, perno).then(() => {
                    return createTimesheet(context, perno, hours);
                });
            }
        });
    });
}

export default function TimeSheetsEntryCreate(context) {
    let employeePicker = libCom.getTargetPathValue(context, '#Control:MemberLstPkr/#Value');
    context.getClientData().EmployeeListPicker = employeePicker;
    const chosenDate = context.evaluateTargetPath('#Control:HourEndDtPicker/#Value');

    let currentIndex = 0;

    var dict = {};
    dict.Date = new ODataDate(chosenDate).toLocalDateString();

    if (employeePicker) {
        context.getClientData().SkipCrewCheck = '';
        let validateExecutor = function() { //Validate the form before creating any crew rows
            if (currentIndex < employeePicker.length) {
                context.getClientData().PersonnelNumber = employeePicker[currentIndex].ReturnValue;
                context.getClientData().EmployeeName = employeePicker[currentIndex].DisplayValue;
                return libTSEvent.ValidateTotalHoursLessThan24(context, dict).then(() => { //Validate 24 hours limit per day for each chosen crew member
                    currentIndex++;
                    return validateExecutor().then((result) => {
                        return Promise.resolve(result);
                    });
                }, function() { //24 hours exceeded so promise was rejected
                    return Promise.resolve(false);
                });
            } else {
                context.getClientData().SkipCrewCheck = 'SKIP'; //Ignore 24 hour check during standard validation, since we already did that
                return libTSEvent.TimeSheetEntryCreateUpdateValidation(context).then(valid => { //Validate rest of data entry form
                    if (valid === false) {
                        return Promise.resolve(false);
                    }
                    return crew.createOverviewIfMissing(context).then(() => { //Add CatsTimesheetOverviewRow if necessary
                        let createPromises = [];

                        for (let i = 0; i < employeePicker.length; i ++) {
                            const hours = libTimesheet.getActualHours(context, context.evaluateTargetPath('#Control:DurationPkr/#Value'));
                            createPromises.push(createTimesheet(context, employeePicker[i].ReturnValue, hours, i));
                        }

                        return Promise.all(createPromises).then(() => {
                            if (crew.getTimesheetRemoveFlag() === true) {
                                crew.setTimesheetRemoveFlag(false);
                                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewEmployeeRemove.action').then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                                });
                            } else {
                                if (IsCompleteAction(context)) {
                                    return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
                                }
                                return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
                            }
                        });
                    }, function() { //createOverviewIfMissing failed
                        return Promise.resolve(false);
                    });
                });
            }
        };
        return validateExecutor().then((result) => {
            return Promise.resolve(result);
        });
    } else {
        return Promise.resolve(true);
    }
}

