import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libThis from './CrewLibrary';
import Logger from '../Log/Logger';
import { GlobalVar as GlobalClass } from '../Common/Library/GlobalCommon';
import TimeSheetCreateUpdateDate from '../TimeSheets/CreateUpdate/TimeSheetCreateUpdateDate';
import FetchRequest from '../Common/Query/FetchRequest';
import ODataDate from '../Common/Date/ODataDate';
import generateGUID from '../Common/guid';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import LocalizationLibrary from '../Common/Library/LocalizationLibrary';

export default class {

    /**
     * Generate query options with existing vehicles to exclude from vehicle add list picker
     * Also save the current list of vehicles in crew to decide later if we are creating or updating
     * @param {*} context
     */
    static crewVehicleCreateQueryOptions(context) {
        try {
            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',['RemovalFlag', 'CrewItemKey'],"$filter=CrewId eq '" + libCom.getStateVariable(context, 'CrewHeaderRow').CrewId + "' and CrewItemType eq '" + context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeVehicle.global').getValue() + "'").then(result => {
                let exclude = '';
                let dict = {};
                if (result && result.length > 0) {
                //Create a dictionary keyed by vehicle to use later
                    result.forEach(function(row) {
                        dict[row.CrewItemKey] = row;
                    });
                    result.forEach(function(row) {
                        if (row.RemovalFlag !== 'X') {
                            if (!libVal.evalIsEmpty(exclude)) {
                                exclude += ' and ';
                            }
                            exclude += "EquipmentNumber ne '" + row.CrewItemKey + "'";
                        }
                    });
                }
                libCom.setStateVariable(context, 'CrewListItemsExisting', dict);
                //Set the list picker query options to exclude vehicles already in the crew
                var filter = '$orderby=EquipmentDesc';
                if (!libVal.evalIsEmpty(exclude)) {
                    exclude = '&$filter=' + exclude;
                }
                return filter + exclude;
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrew.global').getValue(), 'Crew line items read error: ' + err);
            return '';
        }
    }

    /*
     * Generate query options with existing employees to exclude from employee add list picker
     * Also save the current list of employees in crew to decide later if we are creating or updating
     * @param {*} context
     */
    static crewEmployeeCreateQueryOptions(context) {
        try {
            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',['RemovalFlag', 'CrewItemKey'], "$filter=CrewId eq '" + libCom.getStateVariable(context, 'CrewHeaderRow').CrewId + "' and CrewItemType eq '" + context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeEmployee.global').getValue() + "'").then(result => {
                let exclude = '';
                let dict = {};
                if (result && result.length > 0) {
                //Create a dictionary keyed by employee to use later
                    result.forEach(function(row) {
                        dict[row.CrewItemKey] = row;
                    });
                    result.forEach(function(row) {
                        if (row.RemovalFlag !== 'X') {
                            if (!libVal.evalIsEmpty(exclude)) {
                                exclude += ' and ';
                            }
                            exclude += "PersonnelNumber ne '" + row.CrewItemKey + "'";
                        }
                    });
                }
                libCom.setStateVariable(context, 'CrewListItemsExisting', dict);
                var filter = '$orderby=LastName,EmployeeName';
                if (!libVal.evalIsEmpty(exclude)) {
                    exclude = '&$filter=' + exclude;
                }
                return filter + exclude;
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrew.global').getValue(), 'Crew line items read error: ' + err);
            return '';
        }
    }

    static CrewVehicleCreateUpdateValidation(context) {

        if (!context) {
            throw new TypeError('Context can\'t be null or undefined');
        }

        var dict = libCom.getControlDictionaryFromPage(context);
        dict.VehicleDescription.clearValidation();
        dict.VehicleLicense.clearValidation();
        dict.VehiclePoint.clearValidation();
        dict.VehiclePreviousReading.clearValidation();
        dict.VehiclePreviousReadingDate.clearValidation();
        dict.VehicleOdometer.clearValidation();

        let valPromises = [];

        valPromises.push(libThis.CharacterLimitValidation(context, dict.VehicleDescription));
        valPromises.push(libThis.ValidateControlIsRequired(context, dict.VehicleLicense));
        valPromises.push(libThis.ValidateControlIsRequired(context, dict.VehiclePoint));
        valPromises.push(libThis.ValidateOdometerValue(context, dict.VehicleOdometer, dict.VehiclePreviousReading));
        valPromises.push(libThis.ValidateControlIsRequired(context, dict.VehicleOdometer));

        return Promise.all(valPromises).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    static ValidateOdometerValue(context, odometerControl, previousReadingControl) {
        let pass = false;
        let message = '';

        // odometer value should be equal or greater than previous reading
        const odometerValue = odometerControl.getValue() + '';
        const previousReadingValue = previousReadingControl.getValue() + '';
        if (!libVal.evalIsEmpty(odometerValue)) {
            let separator = LocalizationLibrary.getDecimalSeparator(context);
            let separatorIndex = odometerValue.lastIndexOf(separator);
            let groupSeparator = separator === ',' ? '.' : ',';
            let groupSeparatorIndex = odometerValue.lastIndexOf(groupSeparator) + 1;
            
            if (separatorIndex === -1 && groupSeparatorIndex !== 0 && odometerValue.length - groupSeparatorIndex !== 3) {
                message = context.localizeText('wrong_digits_separator');
            } else {
                const odometerCompareValue = LocalizationLibrary.toNumber(context, odometerValue, '', false);
                const previousReadingCompareValue = LocalizationLibrary.toNumber(context, previousReadingValue, '', false);
                if (previousReadingCompareValue <= odometerCompareValue) {
                    pass = true;
                } else {
                    message = context.localizeText('validation_reading_greater_than_or_equal_to_previous_counter_reading', [previousReadingValue]);
                }
            } 
        } else {
            pass = true;
        }

        if (pass) {
            return Promise.resolve(true);
        } else {
            libCom.executeInlineControlError(context, odometerControl, message);
            return Promise.reject(false);
        }
    }

    static ValidateControlIsRequired(context, control) {
        var pass = false;
        var value = control.getValue();
        if (Array.isArray(value)) {
            if (control.getValue()[0]) {
                pass = true;
            }
        } else {
            if (!libVal.evalIsEmpty(value)) {
                pass = true;
            }
        }

        if (pass) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('is_required');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
    }

    static CharacterLimitValidation(context, control) {
        control.clearValidation();
        let descriptionLength = String(control.getValue()).length;
        let characterLimit = libCom.getAppParam(context, 'NOTIFICATION', 'DescriptionLength');
        let characterLimitInt = parseInt(characterLimit);

        if (descriptionLength <= characterLimitInt) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = [characterLimit];
            let message = context.localizeText('validation_maximum_field_length', dynamicParams);
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
    }

    /**
     * Runs when user hits save button on vehicle add screen
     * @param {*} context
     */
    static crewVehicleCreateSave(context) {
        return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdate.action').then(function() {
            const vehicles = libCom.getFieldValue(context, 'VehicleLstPkr', '', null, true);
            //Loop over all vehicles selected for add
            libCom.setStateVariable(context, 'CrewItemKeys', vehicles);
            libCom.setStateVariable(context, 'CrewItemKeyCounter', -1);
            //Start processing the vehicle add loop
            return libThis.crewListItemProcessVehicleLoop(context);
        });
    }

    /**
     * Runs when user hits save button on employee add screen
     * @param {*} context
     */
    static crewEmployeeCreateSave(context) {
        return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdate.action').then(function() {
            const employees = libCom.getFieldValue(context, 'EmployeeLstPkr', '', null, true);
            //Loop over all employees selected for add
            libCom.setStateVariable(context, 'CrewItemKeys', employees);
            libCom.setStateVariable(context, 'CrewItemKeyCounter', -1);
            //Start processing the vehicle add loop
            return libThis.crewListItemProcessEmployeeLoop(context);
        });
    }

    /**
     * Process the next crew list item create or update during vehicle add
     * @param {*} context
     */
    static crewListItemProcessVehicleLoop(context) {
        const vehicles = libCom.getStateVariable(context, 'CrewItemKeys');
        let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
        counter++;
        if (counter === vehicles.length) { //We are done processing rows
            return libThis.createCrewItemVehicleSuccessMessage(context);
        } else { //Process row
            libCom.setStateVariable(context, 'CrewItemKeyCounter', counter);
            const dict = libCom.getStateVariable(context, 'CrewListItemsExisting');
            //Existing deleted row, so update that row to undelete it
            const rowKey = libCom.getStateVariable(context, 'CrewItemKeys')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].ReturnValue;
            if (dict.hasOwnProperty(rowKey)) {
                const row = dict[rowKey];
                context.getClientData().CrewListItemReadLink = row['@odata.readLink'];
                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemVehicleUndelete.action');
            } else { //New row
                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemVehicleCreate.action');
            }
        }
    }

    /**
     * Process the next crew list item create or update during employee add
     * @param {*} context
     */
    static crewListItemProcessEmployeeLoop(context) {
        const employees = libCom.getStateVariable(context, 'CrewItemKeys');
        let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
        counter++;
        if (counter === employees.length) { //We are done processing rows
            return libThis.createCrewItemEmployeeSuccessMessage(context);
        } else { //Process row
            libCom.setStateVariable(context, 'CrewItemKeyCounter', counter);
            const dict = libCom.getStateVariable(context, 'CrewListItemsExisting');
            //Existing deleted row, so update that row to undelete it
            const rowKey = libCom.getStateVariable(context, 'CrewItemKeys')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].ReturnValue;
            if (dict.hasOwnProperty(rowKey)) {
                const row = dict[rowKey];
                context.getClientData().CrewListItemReadLink = row['@odata.readLink'];
                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemEmployeeUndelete.action');
            } else { //New row
                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemEmployeeCreate.action');
            }
        }
    }

    /**
     * Crew header does not exist for today, so create it and default last crew
     * @param {*} context
     */
    static initializeCrewHeaderChangeset(context) {
        return libThis.initializeCrewHeader(context).then(function() { //Read the newly created row into state variable
            //Default crew from last working day's crew that has active crew members
            let crewHeaderQuery = `$orderby=CrewList/OriginTimeStamp desc&$filter=RemovalFlag ne 'X' and CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/CrewId ne '${libCom.getStateVariable(context, 'CrewHeaderCrewId')}'&$top=1`;
            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',['CrewId'],crewHeaderQuery).then(oldHeader => {
                if (oldHeader && oldHeader.length > 0) {
                    const oldCrewHeaderRow = oldHeader.getItem(0);
                    const crewMembersQuery = "$filter=CrewId eq '" + oldCrewHeaderRow.CrewId + "' and RemovalFlag ne 'X'";
                    //Read the old crew members matching the header we found
                    return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',[],crewMembersQuery).then(oldLines => {
                        if (oldLines && oldLines.length > 0) {
                            return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdateInitialize.action').then(function() {
                                libCom.setStateVariable(context, 'OldCrewMembers', oldLines);
                                libCom.setStateVariable(context, 'CrewItemKeyCounter', -1);
                                //Start processing the default crew add loop
                                return libThis.crewListItemProcessDefaultLoop(context);
                            });
                        } else {
                            return Promise.resolve(true);
                        }
                    });
                }
                return Promise.resolve(true);
            });
        });
    }

    /**
     * Process the next crew list item create when defaulting crew for a new date
     * @param {*} context
     */
    static crewListItemProcessDefaultLoop(context) {
        const crew = libCom.getStateVariable(context, 'OldCrewMembers');
        let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
        counter++;
        if (counter === crew.length) { //We are done processing rows
            return Promise.resolve(true);
        } else { //Process row
            libCom.setStateVariable(context, 'CrewItemKeyCounter', counter);
            return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemDefaultCreate.action');
        }
    }

    /**
     * Saves the current user's crew id to state variable if one exists for today.
     * Creates a crew header record if one does not exist for current user for this date.
     * @param {*} context
     */
    static initializeCrewHeader(context) {

        const odataDate = "datetime'" + new ODataDate().toLocalDateString() + "'"; //Today's date
        libCom.clearFromClientData(context, ['CrewHeaderRow', 'CrewHeaderCrewId']);  //Clear the old row info

        try {
            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewLists',[],"$top=1&$filter=SAPUserName eq '" + libCom.getSapUserName(context) + "' and OriginTimeStamp eq " + odataDate).then(result => {
                if (result && result.length > 0) {
                    const row = result.getItem(0);
                    libCom.setStateVariable(context, 'CrewHeaderRow', row);
                    libCom.setStateVariable(context, 'CrewHeaderCrewId', row.CrewId);
                    return Promise.resolve(true);
                } else {
                    libCom.setStateVariable(context, 'CrewHeaderCrewId', generateGUID());
                    return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListCreate.action').then(function() {
                        return context.executeAction('/SAPAssetManager/Actions/Crew/CrewHeaderInitializeChangeSet.action');
                    });
                }
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrew.global').getValue(), 'Crew header read error: ' + err);
            return null;
        }
    }

    /**
     * Creates a crew header and crew member record if one does not exist for date provided
     * Used when adding timesheet records for a crew member
     * @param {*} context
     * @param {Date} date date to add record for
     * @param {string} employee personnel number (key) of employee
     */
    static initializeCrewHeaderAndEmployee(context, date, employee) {

        libCom.clearFromClientData(context, ['TimesheetCrewHeaderCrewId', 'TimesheetOriginTimeStamp', 'TimesheetEmployee']);  //Clear the old data
        let localDateString = new ODataDate(date).toLocalDateString();
        const odataDate = "datetime'" + localDateString + "'";
        libCom.setStateVariable(context, 'TimesheetEmployee', employee);

        try {
            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewLists',['CrewId'],"$top=1&$filter=SAPUserName eq '" + libCom.getSapUserName(context) + "' and OriginTimeStamp eq " + odataDate).then(result => {
                if (result.length === 0) { //Need to add header and employee for this date
                    libCom.setStateVariable(context, 'TimesheetCrewHeaderCrewId', generateGUID());
                    libCom.setStateVariable(context, 'TimesheetOriginTimeStamp', localDateString);
                    return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimesheetCrewListCreate.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimesheetCrewHeaderInitializeChangeSet.action');
                    });
                } else { //Header already exists, check for employee on that date
                    let headerRow = result.getItem(0);
                    return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',['CrewId'],"$top=1&$filter=CrewId eq '" + headerRow.CrewId + "' and CrewItemKey eq '" + employee + "' and CrewItemType eq 'EMPLOYEE'").then(result2 => {
                        if (result2.length === 0) { //Need to add employee for this date
                            libCom.setStateVariable(context, 'TimesheetCrewHeaderCrewId', headerRow.CrewId);
                            return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimesheetCrewHeaderInitializeChangeSet.action');
                        } else { //Employee record already exists
                            return Promise.resolve(true);
                        }
                    });
                }
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCrew.global').getValue(), 'initializeCrewHeaderAndMember read error: ' + err);
            return null;
        }
    }

    /**
    * Sets values for CrewList OData record
    */
    static crewListCreateUpdateSetODataValue(context, key) {
        const row = libCom.getStateVariable(context, 'CrewHeaderRow');
        switch (key) {
            case 'CrewId':
                if (libVal.evalIsEmpty(row)) {
                    return libCom.getStateVariable(context, 'CrewHeaderCrewId');
                } else {
                    return row.CrewId;
                }
            case 'SAPUserName':
                if (libVal.evalIsEmpty(row)) {
                    return libCom.getSapUserName(context);
                } else {
                    return row.SAPUserName;
                }
            case 'UserGuid':
                if (libVal.evalIsEmpty(row)) {
                    return libCom.getUserGuid(context);
                } else {
                    return row.UserGuid;
                }
            case 'OriginTimeStamp':
                if (libVal.evalIsEmpty(row)) {
                    return new ODataDate().toLocalDateString();
                } else {
                    return row.OriginTimeStamp;
                }
            case 'ReadLink':
                return row['@odata.readLink'];
            case 'TimesheetCrewId':
                return libCom.getStateVariable(context, 'TimesheetCrewHeaderCrewId');
            case 'TimesheetOriginTimeStamp':
                return libCom.getStateVariable(context, 'TimesheetOriginTimeStamp');
            default:
                return '';
        }
    }

    /**
    * Sets values for CrewListItem OData record
    */
    static crewListItemCreateUpdateSetODataValue(context, key) {
        let row = libCom.getStateVariable(context, 'CrewHeaderRow');
        switch (key) {
            case 'CrewId':
                if (libVal.evalIsEmpty(row)) {
                    return libCom.getStateVariable(context, 'CrewHeaderCrewId');
                } else {
                    return row.CrewId;
                }
            case 'CrewItemKey':
                return libCom.getStateVariable(context, 'CrewItemKeys')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].ReturnValue;
            case 'CrewItemId':
                return generateGUID();
            case 'TimesheetCrewItemKey':
                return libCom.getStateVariable(context, 'TimesheetEmployee');
            default:
                return '';
        }
    }

    /**
    * Sets values for CrewListItem OData record during default copy routine for new date
    */
    static crewListItemCreateUpdateSetODataValueDefault(context, key) {
        let row = libCom.getStateVariable(context, 'CrewHeaderRow');
        switch (key) {
            case 'CrewId':
                if (libVal.evalIsEmpty(row)) {
                    return libCom.getStateVariable(context, 'CrewHeaderCrewId');
                } else {
                    return row.CrewId;
                }
            case 'CrewItemKey':
                return libCom.getStateVariable(context, 'OldCrewMembers').getItem(libCom.getStateVariable(context, 'CrewItemKeyCounter')).CrewItemKey;
            case 'CrewItemId':
                return generateGUID();
            case 'CrewItemType':
                return libCom.getStateVariable(context, 'OldCrewMembers').getItem(libCom.getStateVariable(context, 'CrewItemKeyCounter')).CrewItemType;
            default:
                return '';
        }
    }

    /**
     * Init these syncronously because we need the results immediately for crew
     * @param {*} context
     */
    static initCrewGlobalStates(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'AppParameters', ['ParamValue', 'ParameterName'], '').then(appParams => {
            let result = Object();
            appParams.forEach(function(param) {
                if (!result[param.ParamGroup]) {
                    result[param.ParamGroup] = Object();
                }
                result[param.ParamGroup][param.ParameterName] = param.ParamValue;
            });
            GlobalClass.setAppParam(result);

            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', ['SystemSettingName', 'SystemSettingValue'], '')
                .then(userProfile => {
                    let systemInfo = new Map(userProfile.map((i) => [i.SystemSettingName, i.SystemSettingValue]));
                    libCom.setStateVariable(context, 'UserSystemInfos', systemInfo);
                    GlobalClass.setUserSystemInfo(systemInfo);

                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(userGeneralInfo => {
                        if (userGeneralInfo && userGeneralInfo.length > 0) {
                            let row = userGeneralInfo.getItem(0);
                            GlobalClass.setUserGeneralInfo(row);
                        }
                        return Promise.resolve(true);
                    });
                });
        });
    }

    /**
     * Runs after crew item vehicles are added successfully
     * @param {*} context
     */
    static createCrewItemVehicleSuccessMessage(context) {
        //Destroy temporary state variables no longer needed
        libCom.clearFromClientData(context, ['CrewListItemsExisting', 'CrewItemKeys', 'CrewItemKeyCounter']);
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Crew/CrewVehicleSuccessMessage.action');
    }

    /**
     * Runs after crew item employees are added successfully
     * @param {*} context
     */
    static createCrewItemEmployeeSuccessMessage(context) {
        //Destroy temporary state variables no longer needed
        libCom.clearFromClientData(context, ['CrewListItemsExisting', 'CrewItemKeys', 'CrewItemKeyCounter']);
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Crew/CrewEmployeeSuccessMessage.action');
    }

    /**
     * Creates the navigation relationships for a new CrewListItem vehicle record
     * @param {*} context
     */
    static crewListItemVehicleLinks(context) {
        var links = [];

        links.push(
            {
                'Property': 'CrewList',
                'Target':
                {
                    'EntitySet': 'CrewLists',
                    'ReadLink': libCom.getStateVariable(context, 'CrewHeaderRow')['@odata.readLink'],
                },
            });

        links.push({
            'Property': 'Fleet',
            'Target':
            {
                'EntitySet': 'Fleets',
                'ReadLink': "Fleets('" + libCom.getStateVariable(context, 'CrewItemKeys')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].ReturnValue + "')",
            },
        });
        return links;
    }

    /**
     * Creates the navigation relationships for a new CrewListItem employee record
     * @param {*} context
     */
    static crewListItemEmployeeLinks(context) {
        var links = [];

        links.push(
            {
                'Property': 'CrewList',
                'Target':
                {
                    'EntitySet': 'CrewLists',
                    'ReadLink': libCom.getStateVariable(context, 'CrewHeaderRow')['@odata.readLink'],
                },
            });

        links.push({
            'Property': 'Employee',
            'Target':
            {
                'EntitySet': 'Employees',
                'ReadLink': "Employees('" + libCom.getStateVariable(context, 'CrewItemKeys')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].ReturnValue + "')",
            },
        });
        return links;
    }

    /**
     * Creates the navigation relationships for a new CrewListItem employee record when added via timesheet
     * @param {*} context
     */
    static timesheetCrewListItemEmployeeLinks(context) {
        var links = [];

        links.push(
            {
                'Property': 'CrewList',
                'Target':
                {
                    'EntitySet': 'CrewLists',
                    'QueryOptions': "$filter=CrewId eq '" + libCom.getStateVariable(context, 'TimesheetCrewHeaderCrewId') + "'",
                },
            });

        links.push({
            'Property': 'Employee',
            'Target':
            {
                'EntitySet': 'Employees',
                'ReadLink': "Employees('" + libCom.getStateVariable(context, 'TimesheetEmployee') + "')",
            },
        });
        return links;
    }

    /**
     * Creates the navigation relationships for a new CrewListItem record during default loop for new date
     * @param {*} context
     */
    static crewListItemDefaultLinks(context) {
        var links = [];
        let row = libCom.getStateVariable(context, 'OldCrewMembers').getItem(libCom.getStateVariable(context, 'CrewItemKeyCounter'));

        if (row.CrewItemType === context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeVehicle.global').getValue()) { //Vehicle
            links.push(
                {
                    'Property': 'CrewList',
                    'Target':
                    {
                        'EntitySet': 'CrewLists',
                        'ReadLink': libCom.getStateVariable(context, 'CrewHeaderRow')['@odata.readLink'],
                    },
                });

            links.push({
                'Property': 'Fleet',
                'Target':
                {
                    'EntitySet': 'Fleets',
                    'ReadLink': "Fleets('" + row.CrewItemKey + "')",
                },
            });
        } else { //Employee
            links.push(
                {
                    'Property': 'CrewList',
                    'Target':
                    {
                        'EntitySet': 'CrewLists',
                        'ReadLink': libCom.getStateVariable(context, 'CrewHeaderRow')['@odata.readLink'],
                    },
                });

            links.push({
                'Property': 'Employee',
                'Target':
                {
                    'EntitySet': 'Employees',
                    'ReadLink': "Employees('" + row.CrewItemKey + "')",
                },
            });
        }
        return links;
    }

    /**
     * Triggered when a tracked field's value changes on the page
     * @param {ControlProxy} control
     */
    static crewListItemCreateOnChange(control) {

        //Clear validation error is the list picker is populated
        if (!libThis.evalPickerControlIsEmpty(control)) {
            control.clearValidation();
        }
    }

    /**
     * handle error and warning processing for vehicle/crew member add
     */
    static crewListItemCreateValidation(context) {

        var dict = libCom.getControlDictionaryFromPage(context);
        dict.InlineErrorsExist = false;
        let control;

        if (dict.hasOwnProperty('VehicleLstPkr')) {
            control = dict.VehicleLstPkr;
        } else {
            control = dict.EmployeeLstPkr;
        }

        libCom.setInlineControlErrorVisibility(control, false);
        control.clearValidation();

        //First process the inline errors
        return libThis.validateListPickerNotBlank(context, dict, control).then(libThis.processInlineErrors.bind(null, dict), libThis.processInlineErrors.bind(null, dict)).then(function() {
            //If there are dialog based validation rules or warnings, add them to the chain here
            return true;
        }, function() {
            return false;
        }); //Pass back true or false to calling action
    }

    /**
     * Picker for add crew cannot be blank
     */
    static validateListPickerNotBlank(context, dict, control) {

        if (!libThis.evalPickerControlIsEmpty(control)) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('field_is_required');
            libCom.executeInlineControlError(context, control, message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
    * Evaluates whether a list picker control is empty
    */
    static evalPickerControlIsEmpty(control) {
        return (libVal.evalIsEmpty(libThis.getFirstListPickerValue(control.getValue())));
    }

    /**
     * Return the first value stored in a list picker array
     */
    static getFirstListPickerValue(array) {
        if (Array.isArray(array) && array.length > 0 && array[0] && array[0].ReturnValue) {
            return array[0].ReturnValue;
        }
        return '';
    }

    /**
     * Called after all inline validation has taken place in the main promise chain.
     * If an inline enabled validation rule has failed, then return a promise failure, else return a promise success
     * Chain will move on to dialog enabled validation if no inline we're triggered
     * @param {*} dict
     */
    static processInlineErrors(dict) {
        if (dict.InlineErrorsExist) {
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }

    }

    /**
     * Returns the total work hours for all of the crew members that belong to the current user's crew for a given date
     * @param context
     * @param date
     */
    static getTotalHoursWithDateForCurrentCrew(context, date) {
        if (!GlobalClass.getUserGeneralInfo()) {
            return '';
        }

        const odataDate = "datetime'" + new ODataDate(date).toLocalDateString() + "'";
        const queryOptions = `$expand=Employee&$orderby=Employee/LastName&$filter=CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/OriginTimeStamp eq ${odataDate} and CrewItemType eq 'EMPLOYEE'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], queryOptions).then(function(result) {
            if (result && result.length > 0) {
                let minutes = 0.0;
                result.forEach(function(element) {
                    // Get time in minutes to minimize compounded rounding errors
                    minutes += Math.round(element.CatsHours * 60);
                });
                // Return time in hours
                return minutes / 60.0;
            } else {
                return 0;
            }
        });
    }

    /**
     * Returns the number of crew members for the current user's crew that have time logged for a given date
     * @param context
     * @param date
     */
    static getTotalCrewMembersWithDate(context, date) {
        if (!GlobalClass.getUserGeneralInfo()) {
            return '';
        }
        const odataDate = "datetime'" + new ODataDate(date).toLocalDateString() + "'";
        const queryOpts = `$filter=RemovalFlag ne 'X' and CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/OriginTimeStamp eq ${odataDate} and CrewItemType eq 'EMPLOYEE'`;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', queryOpts);
    }

    /**
     * Returns the previous working date based on the day of the week
     */
    static getPreviousWorkingDate(date) {
        const day = date.getDay(); // Sunday - Saturday : 0 - 6

        switch (day) {
            case 0: //Today is Sunday so, the previous date needs to be 2 Crew/Month back
                date.setDate(date.getDate() - 2);
                break;
            case 1: //Monday
                date.setDate(date.getDate() - 3);
                break;
            default: //Tuesday through Saturday
                date.setDate(date.getDate() - 1);
                break;
        }
        return date;
    }

    /**
     * Builds the query to get all of the vehicles that belong to the current crew
     */
    static buildCrewListItemsQueryForVehicle(context) {
        const crewId = libCom.getStateVariable(context, 'CrewHeaderCrewId');
        const itemType = context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeVehicle.global').getValue();
        return "$filter=RemovalFlag ne 'X' and CrewId eq '" + crewId + "' and CrewItemType eq '" + itemType + "'&$expand=Fleet/MeasuringPoints";
    }

    /**
     * Builds the query to get all of the employees that belong to the current crew
     */
    static buildCrewListItemsQueryForEmployee(context) {
        const crewId = libCom.getStateVariable(context, 'CrewHeaderCrewId');
        const itemType = context.getGlobalDefinition('/SAPAssetManager/Globals/Crew/ItemTypeEmployee.global').getValue();
        return "$filter=RemovalFlag ne 'X' and CrewId eq '" + crewId + "' and CrewItemType eq '" + itemType + "'&$expand=Employee";
    }

    /**
     * Returns a date string formatted as "<day of week>, <Month> <Date>, <Year>".
     * @param {*} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     * @param {Date} date Javascript Date Object
     * @returns {String} Same date string but formatted differently as stated above.
     */
    static formatJSDateStringWithDayOfWeek(context, date) {
        return libCom.dateToDayOfWeek(date, context) + ', ' + libThis.monthNumberToText(context, date) + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    /**
     * Returns a date string formatted as "<Month> <Date>, <Year>".
     * @param {*} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     * @param {Date} date Javascript Date Object
     * @returns {String} Same date string but formatted differently as stated above.
     */
    static formatJSDateStringWithoutDayOfWeek(context, date) {
        return libThis.monthNumberToText(context, date) + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    /**
     * Returns the month in text based on a given date object
     * @param {*} context
     * @param {Date} date
     */
    static monthNumberToText(context, date) {
        switch (date.getMonth()) {
            case 0:
                return context.localizeText('month0');
            case 1:
                return context.localizeText('month1');
            case 2:
                return context.localizeText('month2');
            case 3:
                return context.localizeText('month3');
            case 4:
                return context.localizeText('month4');
            case 5:
                return context.localizeText('month5');
            case 6:
                return context.localizeText('month6');
            case 7:
                return context.localizeText('month7');
            case 8:
                return context.localizeText('month8');
            case 9:
                return context.localizeText('month9');
            case 10:
                return context.localizeText('month10');
            case 11:
                return context.localizeText('month11');
            default:
                return 'unknown month';
        }
    }

    static setTimesheetRemoveFlag(value) {
        this._timesheetRemoveFlag = value;
    }

    static getTimesheetRemoveFlag() {
        return this._timesheetRemoveFlag;
    }

    /**
     * Create an overview row when adding CATS timesheet for a new date
     * @param {*} context
     */
    static createOverviewIfMissing(context) {

        let date = TimeSheetCreateUpdateDate(context);
        return new FetchRequest('CatsTimesheetOverviewRows').get(context, `datetime'${date}'`).catch(() => {
            // This is missing
            return libThis.createOverviewRow(context, date);
        });

    }

    /**
     *
     * @param {*} context
     * @param {*} date
     */
    static createOverviewRow(context, date) {
        context.getClientData().TimeSheetsOverviewRowDate = date;
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
    }
}
