import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libThis from './ClockInClockOutLibrary';
import ODataDate from '../Common/Date/ODataDate';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import generateGUID from '../Common/guid';

/**
 * Contains all clock in/clock out related methods
 */
export default class {

    /**
     * Does the current work order assignment type allow multiple users to work on the same work order/operation at the same time?
     * @param {*} context
     */
    static isMultiUserAssignmentType(context) {
        let type = libCom.getWorkOrderAssignmentType(context);
        let multiTypes = libCom.getAppParam(context,'CICO','MultipleUserAssignmentTypes');
        if (multiTypes.includes('"' + type + '"')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Is the Clock In/Clock Out feature enabled?
     * @param {*} context
     */
    static isCICOEnabled(context) {
        return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CICO.global').getValue());
    }

    /**
     * Is the business object (work order, operation) currently clocked in?
     * @param {*} context
     * @param {*} collection - link to the UserTimeEntries collection in the object's binding, uses default if not provided
     */
    static isBusinessObjectClockedIn(context, collection=context.binding) {
        if (context.binding && context.binding.UserTimeEntry_Nav) {
            collection = context.binding.UserTimeEntry_Nav;
        } else if (libCom.getBindingObject(context) && libCom.getBindingObject(context).UserTimeEntry_Nav) {
            collection = libCom.getBindingObject(context).UserTimeEntry_Nav;
        }
        
        if (libThis.isCICOEnabled(context)) {
            if (collection) {
                if (collection.length > 0) {
                    let sortUserTimeEntry = collection.sort(function(a, b) { //Sort by date descending
                        return new Date(b.PreferenceValue) - new Date(a.PreferenceValue);
                    })[0];

                    if (sortUserTimeEntry.PreferenceGroup === 'CLOCK_IN') {
                        return true;
                    }
                }
            }
            return false;
        }
        return false;
    }

    /**
     * Return true if the current mobile status should allow override to started-clocked-in if this user is still clocked in to this object
     * Return false if status should not allow overide (complete, review, rejected)
     * @param {*} status Current mobile status for this business object
     */
    static allowClockInOverride(context, status) {
        const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        const REJECTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        const newStatus = status.toUpperCase();

        return (newStatus !== COMPLETE && newStatus !== REVIEW && newStatus !== REJECTED);
    }

    /**
     * Reload the user time entries and add to the current binding
     * @param {*} context
     * @param {*} returnEmpty - Return an empty array
     * @param {*} clockOut - Add the most recent clock out row if it isn't already there
     * @param {*} businessObject - If not empty then this object (WO or Operation) will get its user time entries reloaded
     * @param {*} execute - Does this routine need to execute?
     */
    static reloadUserTimeEntries(context, returnEmpty=false, clockOut, businessObject, execute=true) {
        let binding;
        if (libThis.isCICOEnabled(context) && execute !== false) {
            if (businessObject) {
                binding = businessObject;
            } else {
                binding = libCom.getBindingObject(context);
            }

            if (binding && binding['@odata.type'] && (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation')) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/UserTimeEntry_Nav', [], '$orderby=PreferenceValue asc').then(function(results) {
                    let array = [];
                    if (!returnEmpty && results && results.length > 0) {
                        results.forEach(function(row) {
                            array.push(row);
                        });
                        if (clockOut) {
                            if (!results.getItem(results.length - 1).PreferenceGroup === 'CLOCK_OUT') { //Add the clock out row for this confirmation
                                array.push(clockOut);
                            }
                        }
                    }
                    binding.UserTimeEntry_Nav = array;
                    return Promise.resolve(true);
                }).catch(() => { //Read failure
                    binding.UserTimeEntry_Nav = [];
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClockInOut.global').getValue(),'ClockInClockOutLibrary.reloadUserTimeEntries: UserTimeEntries read failure.');
                    return Promise.resolve(false);
                });
            }
        }

        return Promise.resolve(true);
    }

    /**
     * Is the user currently clocked in to a work order or operation?
     * @param {*} context 
     */
     static isUserClockedIn(context) {
        if (libThis.isCICOEnabled(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId','OperationNo','WOHeader_Nav/ObjectKey','WOOperation_Nav/ObjectKey','WOOperation_Nav/OperationMobileStatus_Nav/MobileStatus','WOHeader_Nav/OrderMobileStatus_Nav/MobileStatus'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav,WOOperation_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOOperation_Nav/OperationMobileStatus_Nav').then(function(results) {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.PreferenceGroup === 'CLOCK_IN') {
                        //Check for orphaned row
                        if (libMobile.isOperationStatusChangeable(context) && row.WOOperation_Nav && row.WOOperation_Nav.OperationMobileStatus_Nav && libThis.allowClockInOverride(context, row.WOOperation_Nav.OperationMobileStatus_Nav.MobileStatus)) {
                            return Promise.resolve(true); //operation level assignment and this operation exists and is a valid mobile status for being clocked-in
                        } else if (libMobile.isHeaderStatusChangeable(context) && row.WOHeader_Nav && row.WOHeader_Nav.OrderMobileStatus_Nav && libThis.allowClockInOverride(context, row.WOHeader_Nav.OrderMobileStatus_Nav.MobileStatus)) {
                            return Promise.resolve(true); //header level assignment and this order exists and is a valid mobile status for being clocked-in
                        } else { //This row is orphaned or somebody else completed the parent object, so remove all the rows for this Work Order or Operation
                            let opNum = '';
                            if (row.OperationNo) {
                                opNum = row.OperationNo;
                            }
                            let query = libThis.getUserTimeEntriesQuery(context, false, row.OrderId, opNum);
                            return libThis.removeUserTimeEntries(context, query, true).then(() => {
                                return Promise.resolve(false);
                            });
                        }
                    }
                }
                return Promise.resolve(false);
            }).catch(() => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClockInOut.global').getValue(),'ClockInClockOutLibrary.isCICOEnabled: UserTimeEntries read failure.');
                return Promise.resolve(false); //Read failure
            });
        }
        return Promise.resolve(false);
    }

    /**
     * Delete the UserTimeEntries rows for this user for the current work order or operation that time was just entered for
     * @param {*} context
     * @param {*} defaultQuery The query is already known, so we don't need to pull it from the time entry screen
     * @param {*} removeAll We are clocking out, so remove all rows, including the last CLOCK_IN row
     * @param {*} saveDeleted We are in a confirmation changeset, so track which rows we delete so we don't delete them again later during clock out completion rollup
     * @param {*} ignoreDeleted We are in a confirmtion changeset and are clocking user out. Ignore the rows we already deleted earlier
     */
    static removeUserTimeEntries(context, defaultQuery, removeAll=false, saveDeleted=false, ignoreDeleted=false) {

        let query;
        let ignoreRows;

        if (defaultQuery) {
            query = defaultQuery;
            if (query === 'SKIP') {
                query = ''; //Exit without removing anything
            }
        } else {
            query = libThis.getUserTimeEntriesQuery(context, true);
        }

        if (ignoreDeleted) {
            ignoreRows = libCom.getStateVariable(context, 'ClockDeletedRows');
        }

        if (query) {
            let index = 0;
            let deleted = {};
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', [], query).then(function(results) {
                if (results && results.length > 0) {
                    let actionExecutor = function() {
                        if (index < results.length) {
                            if (!removeAll && (index === results.length - 1) && results.getItem(index).PreferenceGroup === 'CLOCK_IN') {
                                return Promise.resolve(true); //User is clocked in to this object, so leave that row alone
                            } else {
                                let readLink = results.getItem(index)['@odata.readLink'];
                                libCom.setStateVariable(context,'ClockReadLink', readLink);
                                if (saveDeleted) {
                                    deleted[readLink] = '';
                                }
                                if (ignoreDeleted) {
                                    if (ignoreRows && ignoreRows.hasOwnProperty(readLink)) { //This row was already deleted during this confirmation changeset, so skip it
                                        index++;
                                        return actionExecutor().then((actionResult) => {
                                            return Promise.resolve(actionResult);
                                        });
                                    }
                                }
                                return context.executeAction('/SAPAssetManager/Actions/ClockInClockOut/DeleteUserTimeEntry.action').then(() => {
                                    index++;
                                    return actionExecutor().then((actionResult) => {
                                        return Promise.resolve(actionResult);
                                    });
                                });
                            }
                        } else {
                            return Promise.resolve(true);
                        }
                    };
                    return actionExecutor().then((actionResult) => { //Recursively delete the rows
                        if (saveDeleted) {
                            libCom.setStateVariable(context, 'ClockDeletedRows', deleted); //Save deleted rows for clockOutBusinessObject so we don't try to delete the same rows again during confirmation changeset
                        } else {
                            libCom.removeStateVariable(context, 'ClockDeletedRows');
                        }
                        return libThis.reloadUserTimeEntries(context).then(() => { //Reset the binding for UserTimeEntries
                            return Promise.resolve(actionResult);
                        });
                    });
                } else {
                    return Promise.resolve(false); //No rows to remove
                }
            });
        }
        if (!saveDeleted) {
            libCom.removeStateVariable(context, 'ClockDeletedRows');
        }
        return Promise.resolve(false);
    }

    /**
     * Build the query for reading from UserTimeEntries for the current business object
     * @param {*} context
     */
    static getUserTimeEntriesQuery(context, orderByDate = false, orderId = '', operationNo = '', subOperationNo = '') {

        var woNum;
        var opNum;
        var subOpNum;
        let isTimesheetEnabled = TimeSheetsIsEnabled(context);
        let pageName = libCom.getPageName(context);
        let isOnTimeSheetPage = pageName === 'TimeEntryCreateUpdatePageForWO' || pageName === 'TimeEntryCreateUpdatePage';

        //Pull the work order/operation/sub-operation fields from the time entry or confirmation screen if necessary
        if (orderId) {
            woNum = orderId;
        } else {
            if (isTimesheetEnabled && isOnTimeSheetPage) { // extra check in case time sheets are enabled, but we are on confirmation create
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:RecOrderLstPkr/#Value'))) {
                    woNum = libCom.getTargetPathValue(context, '#Control:RecOrderLstPkr/#Value')[0].DisplayValue;
                    if (woNum.indexOf(' ')) {
                        woNum = woNum.substring(0, woNum.indexOf(' '));
                    }
                }
            } else { //Confirmations
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'))) {
                    woNum = libCom.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value')[0].ReturnValue;
                }
            }
        }

        if (operationNo) {
            opNum = operationNo;
        } else if (libMobile.isOperationStatusChangeable(context) || libMobile.isSubOperationStatusChangeable(context)) {
            if (isTimesheetEnabled && isOnTimeSheetPage) { // extra check in case time sheets are enabled, but we are on confirmation create
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value'))) {
                    opNum = libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value')[0].DisplayValue;
                    if (opNum.indexOf(' ')) {
                        opNum = opNum.substring(0, opNum.indexOf(' '));
                    }
                }
            } else { //Confirmations
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:OperationPkr/#Value'))) {
                    opNum = libCom.getTargetPathValue(context, '#Control:OperationPkr/#Value')[0].ReturnValue;
                }
            }
        }

        if (subOperationNo) {
            subOpNum = subOperationNo;
        } else if (libMobile.isSubOperationStatusChangeable(context)) {
            if (isTimesheetEnabled && isOnTimeSheetPage) { // extra check in case time sheets are enabled, but we are on confirmation create
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:SubOperationLstPkr/#Value'))) {
                    subOpNum = libCom.getTargetPathValue(context, '#Control:SubOperationLstPkr/#Value')[0].DisplayValue;
                    if (subOpNum.indexOf(' ')) {
                        subOpNum = subOpNum.substring(0, subOpNum.indexOf(' '));
                    }
                }
            } else { //Confirmations
                if (libCom.isDefined(libCom.getTargetPathValue(context, '#Control:SubOperationPkr/#Value'))) {
                    subOpNum = libCom.getTargetPathValue(context, '#Control:SubOperationPkr/#Value')[0].ReturnValue;
                }
            }
        }

        let query = '$filter=';
        if (woNum) {
            if (libMobile.isHeaderStatusChangeable(context)) { //Work order assignment type
                query += `OrderId eq '${woNum}'`;

            } else if (libMobile.isOperationStatusChangeable(context)) { //Operation assignment type
                query += `OrderId eq '${woNum}' and OperationNo eq '${opNum}'`;

            } else if (libMobile.isSubOperationStatusChangeable(context)) { //CICO does not support SubOps
                query += `OrderId eq '${woNum}' and OperationNo eq '${opNum}' and SubOperationNo eq '${subOpNum}'`;
            }
        }

        let clockInGlobal = 'START_TIME';
        let clockOutGlobal = 'END_TIME';

        if (libThis.isCICOEnabled(context)) {
            if (!libMobile.isSubOperationStatusChangeable(context)) { //CICO is not supported for suboperations
                clockInGlobal = 'CLOCK_IN';
                clockOutGlobal = 'CLOCK_OUT';
            }
        }

        if (woNum) {
        query += `and (PreferenceGroup eq '${clockInGlobal}' or PreferenceGroup eq '${clockOutGlobal}')`; //this query is also used for mobile status so check for the appropriate PreferenceGroup
        } else {
            query += `(PreferenceGroup eq '${clockInGlobal}' or PreferenceGroup eq '${clockOutGlobal}')`;
        }
        if (orderByDate) {
            query += '&$orderby=PreferenceValue asc'; //Order time entries by date
        }

        if (libCom.getStateVariable(context, 'ClockTimeSaved')) {
            if (libCom.getStateVariable(context, 'ClockTimeSaved') === true) {
                let data = {
                    woNum: woNum,
                    opNum: opNum,
                };
                libCom.setStateVariable(context, 'ClockTimeSaved', data); //Save data to be used later if this object is completed via rollup
            } else {
                libCom.removeStateVariable(context, 'ClockTimeSaved'); //Data is stale, so remove it
            }
        }

        return query;
    }

    /**
     * Returns the current timestamp in ISO format
     * @param {*} context
     */
    static getCurrentTimeStamp(context) {
        var odataDate = new ODataDate();
        return odataDate.toDBDateTimeString(context);
    }

    /**
     * Set binding variables for a work order clock in that will be used by the create action
     * @param {*} context
     */
    static setClockInWorkOrderODataValues(context) {

        let binding = context.getBindingObject();
        binding.ClockRecordId = generateGUID();
        binding.ClockUserGUID = libCom.getUserGuid(context);
        binding.ClockOperationNo = '';
        binding.ClockSubOperationNo = '';
        binding.ClockOrderId = binding.OrderId;
        binding.ClockPreferenceGroup = libThis.isCICOEnabled(context) ? 'CLOCK_IN' : 'START_TIME';
        binding.ClockPreferenceName = binding.OrderId;
        binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
        binding.ClockType = 'WorkOrder';
        binding.ClockSapUserName = libCom.getSapUserName(context);
    }

    /**
     * Set binding variables for a work order clock out that will be used by the create action
     * @param {*} context
     */
    static setClockOutWorkOrderODataValues(context, businessObject) {
        let binding = libCom.getBindingObject(context);

        binding.ClockRecordId = generateGUID();
        binding.ClockUserGUID = libCom.getUserGuid(context);
        binding.ClockOperationNo = '';
        binding.ClockSubOperationNo = '';
        binding.ClockOrderId = binding.OrderId;
        binding.ClockPreferenceGroup = libThis.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME';
        binding.ClockPreferenceName = binding.OrderId;
        binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
        binding.ClockType = 'WorkOrder';
        binding.ClockSapUserName = libCom.getSapUserName(context);

        if (businessObject) {
            binding.ClockOrderId = businessObject.OrderId;
            binding.ClockPreferenceName = businessObject.OrderId;
        }
    }

    /**
     * Set binding variables for a operation clock in that will be used by the create action
     * @param {*} context
     */
    static setClockInOperationODataValues(context) {
        let binding = libCom.getBindingObject(context);
        binding.ClockRecordId = generateGUID();
        binding.ClockUserGUID = libCom.getUserGuid(context);
        binding.ClockOperationNo = binding.OperationNo;
        binding.ClockSubOperationNo = '';
        binding.ClockOrderId = binding.OrderId;
        binding.ClockPreferenceName = binding.OrderId;
        binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
        binding.ClockType = 'Operation';
        binding.ClockPreferenceGroup = libThis.isCICOEnabled(context) ? 'CLOCK_IN' : 'START_TIME';
        binding.ClockSapUserName = libCom.getSapUserName(context);
    }

    /**
     * Set binding variables for a operation clock out that will be used by the create action
     * @param {*} context
     */
    static setClockOutOperationODataValues(context, businessObject) {
        let binding = libCom.getBindingObject(context);
        binding.ClockRecordId = generateGUID();
        binding.ClockUserGUID = libCom.getUserGuid(context);
        binding.ClockOperationNo = binding.OperationNo;
        binding.ClockSubOperationNo = '';
        binding.ClockOrderId = binding.OrderId;
        binding.ClockPreferenceName = binding.OrderId;
        binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
        binding.ClockType = 'Operation';
        binding.ClockPreferenceGroup = libThis.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME';
        binding.ClockSapUserName = libCom.getSapUserName(context);

        if (businessObject) {
            binding.ClockOrderId = businessObject.OrderId;
            binding.ClockPreferenceName = businessObject.OrderId;
            binding.ClockOperationNo = businessObject.OperationNo;
        }
    }

    /**
     * Set binding variables for a sub-operation clock in that will be used by the create action
     * @param {*} context
     */
    static setClockInSubOperationODataValues(context) {
        let binding = libCom.getBindingObject(context);
        binding.ClockRecordId = generateGUID();
        binding.ClockUserGUID = libCom.getUserGuid(context);
        binding.ClockOperationNo = binding.OperationNo;
        binding.ClockSubOperationNo = binding.SubOperationNo;
        binding.ClockOrderId = binding.OrderId;
        binding.ClockPreferenceGroup = 'START_TIME';
        binding.ClockPreferenceName = binding.OrderId;
        binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
        binding.ClockType = 'SubOperation';
        binding.ClockSapUserName = libCom.getSapUserName(context);
    }

    /**
     * Set binding variables for a sub-operation clock out that will be used by the create action
     * @param {*} context
     */
    static setClockOutSubOperationODataValues(context) {
       let binding = libCom.getBindingObject(context);
       binding.ClockRecordId = generateGUID();
       binding.ClockUserGUID = libCom.getUserGuid(context);
       binding.ClockOperationNo = binding.OperationNo;
       binding.ClockSubOperationNo = binding.SubOperationNo;
       binding.ClockOrderId = binding.OrderId;
       binding.ClockPreferenceGroup = 'END_TIME';
       binding.ClockPreferenceName = binding.OrderId;
       binding.ClockPreferenceValue = libThis.getCurrentTimeStamp(context);
       binding.ClockType = 'SubOperation';
       binding.ClockSapUserName = libCom.getSapUserName(context);
    }

    /**
     * Sum the clock in/out pairs to get a time total for this Workorder or Operation
     * @param {*} context
     */

    static getElapsedClockTime(context, orderId, operationNo, subOperationNo) {

        let clockInGlobal = 'START_TIME';
        let clockOutGlobal = 'END_TIME';

        if (libThis.isCICOEnabled(context)) {
            if (!libMobile.isSubOperationStatusChangeable(context)) { //CICO is not supported for suboperations
                clockInGlobal = 'CLOCK_IN';
                clockOutGlobal = 'CLOCK_OUT';
            }
        }

        let count = 0;
        let clockInTime;
        let clockOutTime;

        if (orderId || operationNo) {
            let divisor = 60000; //Confirmations (minutes)
            if (TimeSheetsIsEnabled(context)) {
                divisor = 3600000.0; //Timesheets (hours)
            }
            let query = libThis.getUserTimeEntriesQuery(context, true, orderId, operationNo, subOperationNo);
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceValue','PreferenceGroup'], query).then(function(results) {
                if (results && results.length > 0) {
                    let inIndex;
                    let outIndex;
                    let inFound = false;
                    let outFound = false;

                    //Loop over all rows from oldest to newest, calculating time interval between clock in and clock out pairs
                    //If multiple clock in or clock out rows exist back to back, we throw away the earlier duplicate rows
                    for (let index = 0; index < results.length; index = index + 1) {
                        if (results.getItem(index).PreferenceGroup === clockInGlobal) {
                            inIndex = index;
                            inFound = true;
                        } else if (inFound && results.getItem(index).PreferenceGroup === clockOutGlobal) { //We already found a clock in, so use this clock out to make a pair.  Throw this row out if we don't have a clock in yet
                            if (index + 1 < results.length && results.getItem(index + 1).PreferenceGroup === clockOutGlobal) {
                                continue; //The next row is also a clock out, so throw out the first one
                            }
                            outIndex = index;
                            outFound = true;
                        }
                        if (inFound && outFound) {  //Increment elapsed time using the found pair of clock in/out records
                            clockInTime = OffsetODataDate(context, results.getItem(inIndex).PreferenceValue);
                            clockOutTime = OffsetODataDate(context, results.getItem(outIndex).PreferenceValue);
                            if (clockOutTime.date() > clockInTime.date()) {
                                count += (clockOutTime.date() - clockInTime.date()) / divisor;
                            }
                            inFound = false;
                            outFound = false;
                        }
                    }

                    if (inFound && !outFound) { //If last odd row is a clock in, use current time to calculate elapsed
                        clockInTime = OffsetODataDate(context, results.getItem(inIndex).PreferenceValue);
                        clockOutTime = OffsetODataDate(context, libThis.getCurrentTimeStamp(context));
                        if (clockOutTime.date() > clockInTime.date()) {
                            count += (clockOutTime.date() - clockInTime.date()) / divisor;
                        }
                    }
                    return count; //Elapsed time
                } else { //No rows
                    return count;
                }
            });
        } else { //No order or operation
            return Promise.resolve(count);
        }
    }

    /**
     * When multiple users are sharing objects over multiple devices, sometimes mobile status updates are repeated for the same object, causing a backend error
     * This routine will set an interim status first to prevent back to back duplicates
     * @param {*} context
     */
    static setInterimMobileStatus(context, targetStatus) {

        let binding = libCom.getBindingObject(context);

        if (libThis.isCICOEnabled(context)) {
            var mobileStatus = libMobile.getMobileStatus(binding, context);

            if (targetStatus === mobileStatus) { //New status is the same as old status, so create an interim record first
                var runAction = '';
                let holdStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
                let startStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
                if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                    if (holdStatus === mobileStatus) {
                        runAction = '/SAPAssetManager/Actions/WorkOrders/WorkOrderStartUpdate.action';
                    } else if (startStatus === mobileStatus) {
                        runAction = '/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderHoldUpdate.action';
                    }
                } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                    if (holdStatus === mobileStatus) {
                        runAction = '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationStartUpdate.action';
                    } else if (startStatus === mobileStatus) {
                        runAction = '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationHoldUpdate.action';
                    }
                }
            }
            var odataDate = new ODataDate();
            if (runAction) {
                return context.executeAction({'Name': runAction, 'Properties': {
                    'ObjectKey': (function() {
                        let objectKey = '';
                        //If not a local operation, it will have an ObjectKey value
                        if (binding.ObjectKey) {
                            objectKey = binding.ObjectKey;
                        } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
                            //For local operations, we get the local ObjectKey from PMMobileStatuses record.
                            objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                        }
                        return objectKey;
                    })(),
                    'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Operation,
                    'MobileStatus': libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue()),
                    'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
                    'CreateUserGUID': libCom.getUserGuid(context),
                    'CreateUserId': libCom.getSapUserName(context),
                },
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : binding.OperationMobileStatus_Nav['@odata.readLink'],
                }});
            }
            return Promise.resolve(true);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * Clock out of a work order or operation that we are completing
     * @param {*} context
     * @param {*} businessObject
     */
    static clockOutBusinessObject(context, businessObject) {
        if (libThis.isBusinessObjectClockedIn(context, businessObject.UserTimeEntry_Nav)) { //Handle clock out if this object is clocked in
            if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                let data = libCom.getStateVariable(context, 'ClockTimeSaved');
                let query = 'SKIP';
                if (data && data.hasOwnProperty('woNum')) {
                    if (data.woNum === businessObject.OrderId) {
                        query = libThis.getUserTimeEntriesQuery(context, true, data.woNum, data.opNum);
                    }
                    libCom.removeStateVariable(context, 'ClockTimeSaved');
                }
                return libThis.removeUserTimeEntries(context, query, true, false, true).then(() => {
                    let workOrderContext;
                    try {
                        workOrderContext = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage');
                    } catch (err) {
                        //page does not exist
                    }
                    if (query === 'SKIP') { //Time was not entered, so clock this object out
                        libThis.setClockOutWorkOrderODataValues(context, businessObject);
                        return libThis.clockOutAction(context, businessObject).then(() => {
                            if (workOrderContext) {
                                let binding = context.getBindingObject();
                                let clockOutDummy = {
                                    OrderId: binding.ClockOrderId,
                                    OperationNo: binding.ClockOperationNo,
                                    PreferenceGroup: binding.ClockPreferenceGroup,
                                    PreferenceName: binding.ClockPreferenceName,
                                    PreferenceValue: binding.ClockPreferenceValue,
                                    RecordId: binding.ClockRecordId,
                                    UserGUID: binding.ClockUserGUID,
                                    UserId: binding.ClockSapUserName,
                                };
                                return libThis.reloadUserTimeEntries(workOrderContext, false, clockOutDummy);
                            }
                            return Promise.resolve(true);
                        });
                    } else { //Time was just entered for this WO that we are clocking out, so remove all entries
                        if (workOrderContext) {
                            return libThis.reloadUserTimeEntries(workOrderContext, true);
                        }
                        return Promise.resolve(true);
                    }
                });
            }
            if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                let data = libCom.getStateVariable(context, 'ClockTimeSaved');
                let query = 'SKIP';
                if (data && data.hasOwnProperty('woNum')) {
                    if (data.woNum === businessObject.OrderId && data.opNum === businessObject.OperationNo) {
                        query = libThis.getUserTimeEntriesQuery(context, true, data.woNum, data.opNum);
                    }
                    libCom.removeStateVariable(context, 'ClockTimeSaved');
                }
                return libThis.removeUserTimeEntries(context, query, true, false, true).then(() => {
                    let operationContext;
                    try {
                        operationContext = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage');
                    } catch (err) {
                        //page does not exist
                    }
                    if (query === 'SKIP') { //Time was not entered, so clock this object out
                        libThis.setClockOutOperationODataValues(context, businessObject);
                        return libThis.clockOutAction(context, businessObject).then(() => {
                            if (operationContext) {
                                let binding = context.getBindingObject();
                                let clockOutDummy = {
                                    OrderId: binding.ClockOrderId,
                                    OperationNo: binding.ClockOperationNo,
                                    PreferenceGroup: binding.ClockPreferenceGroup,
                                    PreferenceName: binding.ClockPreferenceName,
                                    PreferenceValue: binding.ClockPreferenceValue,
                                    RecordId: binding.ClockRecordId,
                                    UserGUID: binding.ClockUserGUID,
                                    UserId: binding.ClockSapUserName,
                                };
                                return libThis.reloadUserTimeEntries(operationContext, false, clockOutDummy);
                            }
                            return Promise.resolve(true);
                        });
                    } else { //Time was just entered for this operation that we are clocking out, so remove all entries
                        if (operationContext) {
                            return libThis.reloadUserTimeEntries(operationContext, true);
                        }
                        return Promise.resolve(true);
                    }
                });
            }
        }
        return Promise.resolve(true);
    }

    /**
     * Clock out a business object
     * @param {*} context 
     * @returns 
     */
    static clockOutAction(context) {
        let binding = libCom.getBindingObject(context);
        
        return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
            'Properties': {
                'RecordId': binding.ClockRecordId,
                'UserGUID': binding.ClockUserGUID,
                'OperationNo': binding.ClockOperationNo,
                'SubOperationNo': binding.ClockSubOperationNo,
                'OrderId': binding.ClockOrderId,
                'PreferenceGroup': binding.ClockPreferenceGroup,
                'PreferenceName': binding.ClockPreferenceName,
                'PreferenceValue': binding.ClockPreferenceValue,
                'UserId': binding.ClockSapUserName,
            },
            'Headers': {
                'OfflineOData.RemoveAfterUpload': 'false',
            },
            'CreateLinks': '/SAPAssetManager/Rules/ClockInClockOut/UserTimeEntry/WorkOrderClockInCreateLinks.js',
        }});
    }

}
