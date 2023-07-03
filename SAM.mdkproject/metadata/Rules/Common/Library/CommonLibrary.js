import libVal from './ValidationLibrary';
import libThis from './CommonLibrary';
import Logger from '../../Log/Logger';
import { GlobalVar as GlobalClass } from './GlobalCommon';
import IsAndroid from '../IsAndroid';
import libPersona from '../../Persona/PersonaLibrary';
import resetListPageVariables from '../../Inventory/Common/ResetListPageVariables';
import QueryBuilder from '../Query/QueryBuilder';
import ApplicationSettings from './ApplicationSettings';
import ODataDate from '../Date/ODataDate';

export default class {
    /**
	 * Checks if value is defined; not blank, non-null, and not 'undefined' (or a string representation of 'undefined')
	 * @param {*} value
	 */
    static isDefined(value) {
        return !libVal.evalIsEmpty(value);
    }
    /**
     * Get Page Name from context
     */
    static getPageName(context) {
        if (context.getPageProxy) {
            return context.getPageProxy()._page._definition.getName();
        } else {
            return context._page._definition.getName();
        }
    }

    /**
     * Get Previous Page Name from context
     */
     static getPreviousPageName(context) {
        if (context.getPageProxy) {
            return context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous')._page._definition.getName();
        } else {
            return context.evaluateTargetPathForAPI('#Page:-Previous').exc_page._definition.getName();
        }
    }

    /**
     * DO NOT USE - FOR LEGACY ONLY. PLEASE USE MDK ACTION.
     *
	 * Displays an error message prompt with OK button
     * @param clientAPI {IClientAPI} context of current rule
     * @param messageText {String} message (body) of the dialog
     * @param captionText {String?} caption (title) of the dialog
     * @param okButtonText {String?} OK button text
	 * @returns a rejected promise with false
	 */
    static showErrorDialog(
        clientAPI,
        messageText,
        captionText = clientAPI.localizeText('validation_error'),
        okButtonText = clientAPI.localizeText('ok')) {
        clientAPI.dismissActivityIndicator();
        clientAPI.dismissActivityIndicator();

        if (!clientAPI.getPageProxy) {
            clientAPI.getClientData().DialogMessage = messageText;
            clientAPI.getClientData().DialogTitle = captionText;
            clientAPI.getClientData().DialogOkCaption = okButtonText;
        } else {
            clientAPI.getPageProxy().getClientData().DialogMessage = messageText;
            clientAPI.getPageProxy().getClientData().DialogTitle = captionText;
            clientAPI.getPageProxy().getClientData().DialogOkCaption = okButtonText;
        }

        return clientAPI.executeAction('/SAPAssetManager/Actions/Common/GenericErrorDialog.action').then(function() {
            return Promise.reject(false);
        });
    }

    /**
     * DO NOT USE - FOR LEGACY ONLY. PLEASE USE MDK ACTION.
     *
	 * Displays a warning message prompt with OK and Cancel buttons
     * @param clientAPI {IClientAPI} context of current rule
     * @param messageText {String} message (body) of the dialog
     * @param captionText {String?} caption (title) of the dialog
     * @param okButtonText {String?} OK button text
     * @param cancelButtonText {String?} Cancel button text
	 * @returns a promise fulfilled with True (OK) or rejected with False (Cancel)
	 */
    static showWarningDialog(
        clientAPI,
        messageText,
        captionText = clientAPI.localizeText('validation_warning'),
        okButtonText = clientAPI.localizeText('ok'),
        cancelButtonText = clientAPI.localizeText('cancel')) {
        clientAPI.dismissActivityIndicator();

        if (!clientAPI.getPageProxy) {
            clientAPI.getClientData().DialogMessage = messageText;
            clientAPI.getClientData().DialogTitle = captionText;
            clientAPI.getClientData().DialogOkCaption = okButtonText;
            clientAPI.getClientData().DialogCancelCaption = cancelButtonText;
        } else {
            clientAPI.getPageProxy().getClientData().DialogMessage = messageText;
            clientAPI.getPageProxy().getClientData().DialogTitle = captionText;
            clientAPI.getPageProxy().getClientData().DialogOkCaption = okButtonText;
            clientAPI.getPageProxy().getClientData().DialogCancelCaption = cancelButtonText;
        }

        return clientAPI.executeAction('/SAPAssetManager/Actions/Common/GenericWarningDialog.action').then(function(result) {
            if (result.data === true) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(false);
            }
        });
    }

    /**
     * Evaluates a target path to find the field name on the current page
     * Returns a string containing the field value
     *
     * @param {string} name - screen field name
     * @param {string} key - name to use when storing value in dictionary
     * @param {object} dict - dictionary object to store result
     * @param {boolean} trim - whether to trim a string result of leading and trailing spaces
     */
    static getFieldValue(clientAPI, name, key = '', dict, trim = false) {
        var keyVal = (libVal.evalIsEmpty(key)) ? name : key;
        var field = undefined;

        if (!libVal.evalIsEmpty(keyVal)) {
            try {
                field = this.getTargetPathValue(clientAPI, '#Control:' + name + '/#Value', keyVal, dict, trim);
            } catch (err) {
                /**Implementing our Logger class*/
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err.message);
            }
            return field;
        }
        return field;
    }

    /**
     * Evaluates a target path to find value
     * Returns whatever the target path evaluated to, or empty string if the target returned null or did not exist
     * params:
     * @param {string} path - target path
     * @param {string} key - name to use when storing value in dictionary
     * @param {object} dict - dictionary object to store result
     * @param {boolean} trim - whether to trim a string result of leading and trailing spaces
     */
    static getTargetPathValue(clientAPI, path, key, dict, trim = false) {
        let value = null;
        try {
            value = clientAPI.evaluateTargetPath(path);
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'getTargetPathValue: ' + err.message);
        }

        if (libVal.evalIsEmpty(value)) value = ''; //SnowBlind is returning undefined for screen controls that have no value :-(
        if (trim && (typeof value === 'string')) value = value.trim();
        if (dict) {
            dict[key] = value;
        }
        return value;
    }

    /**
	 * Return all controls in a dictionary keyed by field name
	 * Works for a page with a form cell container holding child fields
	 */
    static getControlDictionary(clientAPI) {

        var formcell = clientAPI.getPageAPI().getControls()[0];
        var subcontrols = formcell.getControls();
        var dict = {};

        for (let control of subcontrols) {
            dict[control.definition().getName()] = control;
        }
        return dict;
    }

    /**
	 * Return a dictionary of all page controls keyed by control name
	 */
    static getControlDictionaryFromPage(clientAPI) {
        /**
         * Recursively loop over page controls digging deeper if a "_controls" property exists.
         * Save all controls in the "dict" dictionary that was passed here by reference
         */
        let buildControlDictionaryForSubControls = function(subcontrols, dict) {
            var childControls;
            for (let control of subcontrols) {
                dict[control.getName()] = control;
                if (control.isContainer()) {
                    childControls = control.getControls();
                    if (childControls.length > 0) buildControlDictionaryForSubControls(childControls, dict);
                }
            }
        };

        var dict = {};
        var pageControls;
        if (clientAPI.getPageProxy) {
            pageControls = clientAPI.getPageProxy().getControls();
        } else {
            pageControls = clientAPI.getControls();
        }
        if (pageControls.length > 0) buildControlDictionaryForSubControls(pageControls, dict);
        return dict;
    }

    static refreshPage(context) {
        if (context) {
            if (context.getControls()) {
                var controls = context.getControls();
                for (var i = 0; i < controls.length; i++) {
                    controls[i].redraw();
                }
            }
        }
    }

    /**
     * Redraws all the controls inside a section on page.
     *
     * @param {*} context The context proxy depending on where this rule is being called from.
     * @param {*} pageName Name of the page
     * @param {*} sectionName Name of the section
     */
    static redrawPageSection(context, pageName, sectionName) {
        /**Implementing our Logger class*/
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `Called CommonLibrary.redrawPageSection(context, ${pageName}, ${sectionName})`);
        try {
            let pageProxy = context.evaluateTargetPathForAPI('#Page:' + pageName);
            if (pageProxy) {
                let sectionedTbl = pageProxy.getControl(sectionName);
                if (sectionedTbl) {
                    sectionedTbl.redraw();
                }
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `CommonLibrary.redrawPageSection(context, ${pageName}, ${sectionName}) error: ${err}`);
        }
    }
    /**
     * 
	 * Set a state variable on the given page
	 */
    static setStateVariable(clientAPI, key, value,
        pageName = libPersona.getPersonaOverviewStateVariablePage(clientAPI)) {

        if ((key === 'StatusStartDate' || key === 'StatusEndDate') && value instanceof Date) {
            ApplicationSettings.setString(clientAPI, key, value.toJSON());
        } else {
            try {
                let page = clientAPI.evaluateTargetPath('#Page:' + pageName);
                const pageData = page.context.clientData;
                pageData[key] = value;
            } catch (err) {
                /**Implementing our Logger class*/
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Reference to page not found: ' + pageName);
            }
        }
    }

    /**
	* Get a state variable on the given page
	*/
    static getStateVariable(clientAPI, key,
        pageName = libPersona.getPersonaOverviewStateVariablePage(clientAPI)) {

        if (key === 'StatusStartDate' || key === 'StatusEndDate') {
            return new Date(ApplicationSettings.getString(clientAPI, key));
        } else {
            try {
                let page = clientAPI.evaluateTargetPath('#Page:' + pageName);
                const pageData = page.context.clientData;
                if (pageData.hasOwnProperty(key)) {
                    return pageData[key];
                } else {
                    /**Implementing our Logger class*/
                    Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Property not found in clientData: ' + key);
                    return undefined;
                }
            } catch (err) {
                /**Implementing our Logger class*/
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Reference to page not found: ' + pageName);
                return undefined;
            }
        }
    }

    /**
     * Removes a state variable. After being removed pageData[your state variable] = undefined.
     * @param {*} clientAPI  - You base ClientAPI
     * @param {*} keys  - name of the state variable you want to remove. This can be an Array of variables or just one value.
     * @param {*} pageName  - optional. The name of the page where this variable is saved. If not passed in, it defaults to a global which is usually the Overview.page.
     */
    static removeStateVariable(clientAPI, keys,
        pageName = libPersona.getPersonaOverviewStateVariablePage(clientAPI)) {
        try {
            let page = clientAPI.evaluateTargetPath('#Page:' + pageName);
            const pageData = page.context.clientData;
            if (Array.isArray(keys)) {
                keys.forEach(function(key) {
                    delete pageData[key];
                });
            } else if (pageData.hasOwnProperty(keys)) {
                delete pageData[keys];
            }
        } catch (err) {
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err);
        }
    }

    /**
     * Clears the value of a state variable by setting it to a empty string. After being cleared pageData[your state variable] = ''.
     * @param {*} clientAPI  - You base ClientAPI
     * @param {*} keys  - name of the state variable you want to clear. This can be an Array of variables or just one value.
     * @param {*} pageName  - optional. The name of the page where this variable is saved. If not passed in, it defaults to a global which is usually the Overview.page.
     */
    static clearStateVariable(clientAPI, keys,
        pageName = libPersona.getPersonaOverviewStateVariablePage(clientAPI)) {
        try {
            let page = clientAPI.evaluateTargetPath('#Page:' + pageName);
            const pageData = page.context.clientData;
            if (Array.isArray(keys)) {
                keys.forEach(function(key) {
                    pageData[key] = '';
                });
            } else if (pageData.hasOwnProperty(keys)) {
                pageData[keys] = '';
            }
        } catch (err) {
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err);
        }
    }

    /**
	* Get a reference to the clientData object on the given page
	*/
    static getClientDataForPage(clientAPI,
        pageName = libPersona.getPersonaOverviewStateVariablePage(clientAPI)) {
        try {
            let page = clientAPI.evaluateTargetPath('#Page:' + pageName);
            return page.context.clientData;
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Reference to page not found: ' + pageName);
            return null;
        }
    }

    /**
	 * Set the TransactionType flag to "CREATE", or "UPDATE", else will be reset to empty string ""
	 * @param {*} clientAPI
	 * @param {string} FlagValue
	 */
    static setOnCreateUpdateFlag(clientAPI, FlagValue) {
        /* Debugging info for state variables */
        let callingPage = 'unknown';
        if (this.flags === undefined) {
            this.flags = {};
        }
        try {
            if (clientAPI.getPageProxy()) {
                callingPage = clientAPI.getPageProxy().currentPage.id;
            } else {
                callingPage = clientAPI.currentPage.id;
            }
        } catch (exc) {
            // Do nothing...
        }
        this.flags.CreateUpdateFlagPage = callingPage;
        /* End state variable debugging info */

        //If the value is not either "CREATE"" or "UPDATE", force it to empty ""
        if (FlagValue === 'CREATE' || FlagValue === 'UPDATE') {
            Logger.info('***STATE VARIABLE***', `OnCreate Flag set to ${FlagValue}. Calling Page: ${callingPage}`);
            this.setStateVariable(clientAPI, 'TransactionType', FlagValue);
        } else {
            Logger.info('***STATE VARIABLE***', `OnCreate Flag Unset. Calling Page: ${callingPage}`);
            this.setStateVariable(clientAPI, 'TransactionType', '');
        }
    }

    /**
	 * Set the counter for the change set actions to 0
	 * @param {*} clientAPI
	 */
    static resetChangeSetActionCounter(clientAPI) {
        this.setStateVariable(clientAPI, 'ChangeSetActionCounter', 0);
    }

    /**
	 * Increment the counter for the change set actions
	 * @param {*} clientAPI
	 */
    static incrementChangeSetActionCounter(clientAPI) {
        let currentCounter = this.getCurrentChangeSetActionCounter(clientAPI);
        currentCounter++;
        this.setStateVariable(clientAPI, 'ChangeSetActionCounter', currentCounter);
    }

    /**
	 * Get the current counter for the changeset actions
	 * @param {*} clientAPI
	 */
    static getCurrentChangeSetActionCounter(clientAPI) {
        return this.getStateVariable(clientAPI, 'ChangeSetActionCounter');
    }

    /**
	 * Check if we are on Create mode
	 * @param {IClientAPI} clientAPI
	 * @returns {boolean}
	 */
    static IsOnCreate(clientAPI) {
        let transType = this.getStateVariable(clientAPI, 'TransactionType');
        return (transType === 'CREATE');
    }

    /**
	 * Set the ChangeSet flag
	 * @param {IPageProxy} clientAPI
	 * @param {boolean} FlagValue
	 */
    static setOnWOChangesetFlag(clientAPI, FlagValue) {
        /* Debugging info for state variables */
        let callingPage = 'unknown';
        if (this.flags === undefined) {
            this.flags = {};
        }
        try {
            if (clientAPI.getPageProxy()) {
                callingPage = clientAPI.getPageProxy().currentPage.id;
            } else {
                callingPage = clientAPI.currentPage.id;
            }
        } catch (exc) {
            // Do nothing...
        }
        this.flags.WOChangesetFlagPage = callingPage;
        /* End state variable debugging info */

        Logger.info('***STATE VARIABLE***', `Work Order Change Set Flag set to ${FlagValue}. Calling Page: ${callingPage}`);
        this.setStateVariable(clientAPI, 'ONWOCHANGESET', FlagValue);
    }

    /**
     * check if we are in the middle of the WO changeset action
     * @param {IPageProxy} clientAPI
     */
    static isOnWOChangeset(clientAPI) {
        return this.getStateVariable(clientAPI, 'ONWOCHANGESET');
    }

    /**
	 * Set the WO ChangeSet flag
	 * @param {IPageProxy} clientAPI
	 * @param {boolean} FlagValue
	 */
    static setOnChangesetFlag(clientAPI, FlagValue) {
        /* Debugging info for state variables */
        let callingPage = 'unknown';
        if (this.flags === undefined) {
            this.flags = {};
        }
        try {
            if (clientAPI.getPageProxy()) {
                callingPage = clientAPI.getPageProxy().currentPage.id;
            } else {
                callingPage = clientAPI.currentPage.id;
            }
        } catch (exc) {
            // Do nothing...
        }
        this.flags.ChangesetFlagPage = callingPage;
        /* End state variable debugging info */

        Logger.info('***STATE VARIABLE***', `Generic Change Set Flag set to ${FlagValue}. Caling Page: ${callingPage}`);
        this.setStateVariable(clientAPI, 'ONCHANGESET', FlagValue);
    }

    /**
     * check if we are in the middle of changeset action
     * @param {IPageProxy} clientAPI
     */
    static isOnChangeset(clientAPI) {
        let flag = this.getStateVariable(clientAPI, 'ONCHANGESET');
        return flag;
    }

    /**
     * SAP Measuring Point records return numbers with decimal separators from different locales
     * For now, change the European comma to a western period decimal point
     */
    static convertSapStringToNumber(value) {
        if (typeof value === 'string') {
            if (libVal.evalIsEmpty(value)) {
                return '';
            } else {
                try {
                    var strValue = value.toString();
                    return parseFloat(strValue.replace(/,/g, '.'));
                } catch (err) {
                    /**Implementing our Logger class*/
                    Logger.error('COMMON', err.message);
                    return value;
                }
            }
        } else {
            // if value is a number then dont do any conversion
            return value;
        }
    }

    /**
     * Return the value stored in a single-selection list picker array
     */
    static getListPickerValue(array) {
        if (Array.isArray(array) && array.length === 1 && array[0] && array[0].ReturnValue) {
            return array[0].ReturnValue;
        } else if (Array.isArray(array) && array.length > 1) {
            return libThis.getListMultiplePickerValue(array);
        }
        return '';
    }

    /**
     * Return the value stored in a single-selection list picker array
     */
    static getListMultiplePickerValue(array) {
        if (Array.isArray(array) && array.length > 0 && array[0] && array[0].ReturnValue) {
            return array[0].ReturnValue;
        }
        return '';
    }

    /**
     * Return the display value stored in a single-selection list picker array
     */
    static getListPickerDisplayValue(array) {
        if (Array.isArray(array) && array.length === 1 && array[0] && array[0].ReturnValue) {
            return array[0].DisplayValue;
        }
        return '';
    }

    static dateToDayOfWeek(date, clientAPI) {
        var dt = '';
        switch (date.getDay()) {
            case 0:
                dt = clientAPI.localizeText('day0');
                break;
            case 1:
                dt = clientAPI.localizeText('day1');
                break;
            case 2:
                dt = clientAPI.localizeText('day2');
                break;
            case 3:
                dt = clientAPI.localizeText('day3');
                break;
            case 4:
                dt = clientAPI.localizeText('day4');
                break;
            case 5:
                dt = clientAPI.localizeText('day5');
                break;
            case 6:
                dt = clientAPI.localizeText('day6');
                break;
            default:
                dt = 'unknown day';
                break;
        }
        return dt;
    }

    /**
     * Retrieve the relative day of the week
     *
     * @param {*} date - date to retrieve the relative date of
     * @param {*} clientApi - calling context
     */
    static relativeDayOfWeek(date, clientApi) {

        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        let milliDelta = date.getTime() - now.getTime();

        let dayInMillis = 24 * 60 * 60 * 1000;

        if (milliDelta < 0) {
            if (milliDelta >= -1 * dayInMillis) {
                // yesterday
                return clientApi.localizeText('day_yesterday');
            }
        } else if ( milliDelta < dayInMillis) {
            // Today
            return clientApi.localizeText('day_today');
        }
        return this.dateToDayOfWeek(date, clientApi);
    }

    /**
     * pass in the readLink of the entity, it will return wether the entity is local or not
     *
     * @static
     * @param {string} readLink
     */
    static isCurrentReadLinkLocal(readLink) {
        return (readLink.indexOf('lodata_sys_eid') !== -1);
    }

    /**
     * Generates a unique local ID
     */
    static GenerateOfflineEntityId() {
        let newId = Math.round(new Date().getTime()).toString();
        return newId;
    }

    /**
     * Gets a control proxy reference from the page's form cell container matching the passed in name
     */
    static getControlProxy(
        pageProxy,
        name,
        containerName = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultFormCellContainerControlName.global').getValue()) {

        let container = pageProxy.getControl(containerName);
        if (container) {
            // handle the case of the MDK not allowing extensions to provide their own ClientAPI
            if (!container.hasOwnProperty('getControl')
                && container.hasOwnProperty('_control')
                && (typeof container._control.getCellProxyWithName === 'function')) {
                return container._control.getCellProxyWithName(name);
            } else if (name.includes('Hierarchy')) {
                return container.getControl(name)._control._extension;
            }
            return container.getControl(name);
        } else {
            return null;
        }
    }

    /**
     * Gets a user related propery value from UserGeneralInfos given the property name that you want
     * @param {ClientAPI} pageClientAPI
     * @param {string} propertyName Property name
     * @return propertyValue User property value or blank if nothing is found.
     */
    static getUserProperty(pageClientAPI, propertyName) {
        var propertyValue = '';
        let row = GlobalClass.getUserGeneralInfo();
        if (!row) {
            /**Implementing our Logger class*/
            Logger.error(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'getUserProperty: Error - In memory row does not exist.');
        } else {
            if (row.hasOwnProperty(propertyName)) {
                propertyValue = row[propertyName];
            }
            return propertyValue;
        }
        return propertyValue;
    }

    static getNotificationPlanningPlant(context) {
        return this.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
    }

    /**
      * Gets flag for mobile status task sucess
      * @param {context} context
      * @return Yes or No from config panel
      */

     static getTaskSucessFlag(context) {
         return this.getAppParam(context, 'NOTIFICATION', 'TaskSuccess');
     }

    /**
     * Gets Mileage ActivityType
     * @param {*} context 
     */
    static getMileageActivityType(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Mileage/MileageGroup.global').getValue(), 'MileageActivityType');
    }

    /**
     * Gets Mileage Unit of Measure
     * @param {*} context 
     */
    static getMileageUOM(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Mileage/MileageGroup.global').getValue(), 'MileageUOM');
    }

    /**
     * Gets Mileage WorkCenter
     * @param {*} context 
     */
       static getMileageWorkCenter(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Mileage/MileageGroup.global').getValue(), 'MileageWorkCenter');
    }

    /**
     * Gets Expense ActivityType
     * @param {*} context 
     */
    static getExpenseActivityType(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/Expenses.global').getValue(), 'ExpenseActivityType') || '';
    }

    /**
     * Gets Expense WorkCenter
     * @param {*} context 
     */
      static getExpenseWorkCenter(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/Expenses.global').getValue(), 'ExpenseWorkCenter') || '';
    }

    
    static getSetUsage(context) {
        return this.getAppParam(context, context.getGlobalDefinition('/SAPAssetManager/Globals/InspectionLots/InspectionLot.global').getValue(), 'SetUsage');
    }

    static getUserDefaultWorkCenter() {
        return this.getUserSystemInfo().get('USER_PARAM.AGR');
    }

    static getUserDefaultStorageLocation() {
        return this.getUserSystemInfo().get('USER_PARAM.LAG');
    }

    static getUserDefaultPlant() {
        // the default plant should be changed from IWK to WRK
        return this.getUserSystemInfo().get('USER_PARAM.WRK');
    }
    static getUserDefaultPlanningPlant() {
        return this.getUserSystemInfo().get('USER_PARAM.IWK');
    }
    static getUserDefaultMainternancePlant() {
        return this.getUserSystemInfo().get('USER_PARAM.SWK');
    }

    static getOperationsTimelineStatuses(context) { 
            try {
               let statuses = [];
                Object.entries(GlobalClass.getAppParam().MOBILESTATUS_TIMELINE_SEQ_OPERATION).forEach((items)=> {
                    statuses.push(items[1]);
                });
               return statuses;
            } catch (exc) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfiguration.global').getValue(), 'MOBILESTATUS_TIMELINE_SEQ_OPERATION was not set on the App Params configuration');
                return [];
            }
    }

    static getWOTimelineStatuses(context) {  
        try {
           let statuses = [];
            Object.entries(GlobalClass.getAppParam().MOBILESTATUS_TIMELINE_SEQ_WORKORDER).forEach((items)=> {
                statuses.push(items[1]);
            });
           return statuses;
        } catch (exc) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfiguration.global').getValue(), 'MOBILESTATUS_TIMELINE_SEQ_WORKORDER was not set on the App Params configuration');
            return [];
        }

    }

    /**
     * Returns the UserSystemInfo parameter matching the property.  If the property does not exist, returns
     * an empty string.
     * @param {*} context
     * @param {*} property
     */
    static getUserSystemInfoProperty(context, property) {
        var prop = this.getUserSystemInfo(context).get(property);
        if (prop) {
            return prop;
        } else {
            return '';
        }

    }
    /**
     * Gets a user related propery value from UserSystemInfos given the property name that you want.
     * @param pageClientAPI
     * @param groupName    SystemSettingGroup name
     * @param propertyName SystemSettingName name
     * @return SystemSettingVAlue User property value or empty string if nothing is found.
     */
    static getUserSystemProperty(pageClientAPI, groupName, propertyName) {
        var propertyValue = '';
        var filter = "$filter=SystemSettingGroup eq '" + groupName + "' and SystemSettingName eq '" + propertyName + "'";

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', [], filter).then(userSystemInfo => {
            if (userSystemInfo.length > 0) {
                propertyValue = userSystemInfo.getItem(0).SystemSettingValue;
            }
            if (libVal.evalIsEmpty(propertyValue)) {
                Logger.error(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfiguration.global').getValue(), propertyName+' in  '+groupName+' was not set on User System Properties');
                return '';
            } else {
                return propertyValue;
            }
        });
    }

    /**
     * Gets the UserGUID for the currently logging in user.
     * @param {ClientAPI} pageClientAPI
     * @return {string} The UserGUID value as a string or blank if one is not found.
     */
    static getUserGuid(pageClientAPI) {
        return libThis.getUserProperty(pageClientAPI, 'UserGuid');
    }

    /**
     * Gets a count of rows
     */
    static getEntitySetCount(clientAPI, entitySet, queryOptions, service = '/SAPAssetManager/Services/AssetManager.service') {
        
        return clientAPI.count(service, entitySet, queryOptions).then((result) => {
            return result;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err);
            return 0;
        });
    }

    /**
     * Gets a count of rows online
     */
    static getEntitySetCountOnline(clientAPI, entitySet, queryOptions) {
        //return clientAPI.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
                return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, queryOptions).then((result) => {
                    return result;
                }).catch(err => {
                    /**Implementing our Logger class*/
                    Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), err);
                    return 0;
                });
            });
        //});
    }

    /**
     * Opens document details page for the Inventory Persona
     */
     static openInventoryDocDetailsPage(context, entitySet, queryOptions) {
        let query = queryOptions;
        if (!query.includes('$expand=')) {
            query += '&$expand=OutboundDelivery_Nav,ReservationHeader_Nav,PurchaseOrderHeader_Nav,StockTransportOrderHeader_Nav,InboundDelivery_Nav,PhysicalInventoryDocHeader_Nav,ProductionOrderHeader_Nav/ProductionOrderItem_Nav/Material_Nav,MaterialDocument_Nav/RelatedItem';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
            if (data.length === 1) {
                this.setStateVariable(context, 'EmptySearchOnOverview', true);
                let docInfo = data.getItem(0);
                if (docInfo.PurchaseOrderHeader_Nav) {
                    resetListPageVariables(context);
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PurchaseOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderDetailsNav.action');
                } else if (docInfo.InboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.InboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action');
                } else if (docInfo.StockTransportOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.StockTransportOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderDetailsNav.action');
                } else if (docInfo.OutboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.OutboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action');
                } else if (docInfo.ReservationHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ReservationHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action');
                } else if (docInfo.PhysicalInventoryDocHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PhysicalInventoryDocHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action');
                } else if (docInfo.ProductionOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ProductionOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderDetailsNav.action');
                } else if (docInfo.MaterialDocument_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.MaterialDocument_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action');
                }
            }
            return false;
        });
    }

    /**
     * Gets SAP User Name
     */
    static getSapUserName(pageClientAPI) {
        return libThis.getUserProperty(pageClientAPI, 'SAPUserName');
    }
    /**
     * Get user Personnel Area
     */
    static getUserPersArea(pageClientAPI) {
        return libThis.getUserSystemProperty(pageClientAPI, 'HR.USER', 'PERS_AREA');
    }

    /**
     * Get user Personnel SubArea
     */
    static getUserPersSubArea(pageClientAPI) {
        return libThis.getUserSystemProperty(pageClientAPI, 'HR.USER', 'PERS_SUBAREA');
    }

    static getBackendOffsetFromSystemProperty(pageClientAPI) {

        return Number(libThis.getUserSystemInfoProperty(pageClientAPI, 'SAP_SYSTEM_TZONE_UTC_OFFSET'));
    }

    /**
     * get the app parameters
     * @param {*} pageProxy
     * @return {Map} Map that contains all app parameters
     */
    static getAppParam(pageProxy, paramGroup, paramName) {
        try {
            return GlobalClass.getAppParam()[paramGroup][paramName];
        } catch (exc) {
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfiguration.global').getValue(), `${exc}: ${paramName} ${paramGroup} was not set on the App Params configuration`);
            return undefined;
        }
    }

    /**
     * get user profile
     *
     * @static
     * @param {any} pageProxy
     * @return {string}
     */
    static getUserSystemInfo() {
        return GlobalClass.getUserSystemInfo();
    }

    /**
     * get user general info
     *
     * @static
     * @param {PageProxy} pageProxy
     * @return {string}
     */
    static getUserGeneralInfo() {
        return GlobalClass.getUserGeneralInfo();
    }

    /**
     * More conventional convenience method for setting editable state
     * @param {ControlProxy} control
	 * @param {Boolean} isEditable
     */

    static setEditable(control, isEditable) {
        control.setEditable(isEditable);

    }

    /**
     * Set the non-editable style: light grey background
     * @param {ControlProxy} controlProxy
     */
    static setFormcellNonEditable(controlProxy) {
        controlProxy.setEditable(false);
    }

    /**
     * Set the editable style: light grey background
     * @param {ControlProxy} controlProxy
     */
    static setFormcellEditable(controlProxy) {
        controlProxy.setEditable(true);
    }

    /**
     * gets the Workorder Assignment Type value in application parameters
     * @param {PageProxy} pageClientAPI
     */
    static getWorkOrderAssignmentType(pageClientAPI) {
        return this.getAppParam(pageClientAPI, 'ASSIGNMENTTYPE', 'WorkOrder');
    }

    /**
     * get the assignment type level
     * @param {PageProxy} context
     * @returns {string} 'WorkOrder', 'Operation', 'SubOperation'
     */
    static getWorkOrderAssnTypeLevel(context) {
        const assnType = this.getAppParam(context, 'ASSIGNMENTTYPE', 'WorkOrder');
        switch (assnType) {
            case '1':
            case '5':
            case '7':
            case '8':
                return 'Header';
            case '2':
            case '4':
            case '6':
            case 'A':
                return 'Operation';
            case '3':
                return 'SubOperation';
            default:
                return 'No Assigment Type';
        }
    }

    /**
     * gets the Notification Assignment Type value in application parameters
     * @param {PageProxy} pageClientAPI
     */
    static getNotificationAssignmentType(pageClientAPI) {
        return this.getAppParam(pageClientAPI, 'ASSIGNMENTTYPE', 'Notification');
    }

    /**
     * gets the Personnel Number value in User System Info parameters
     * @param {PageProxy} pageClientAPI
     */
    static getPersonnelNumber() {
        let appParams = this.getUserSystemInfo();
        if (appParams) {
            if (appParams.get('PERNO')) {
                return appParams.get('PERNO');
            }
        }
        return '';
    }

    /**
     * Turns on inline validation error for the passed in screen control
     * @param {*} control
     * @param {*} message
     * @param {*} msgColor
     * @param {*} bgColor
     * @param {*} separatorColor
     */
    static executeInlineControlError(context, control, message,
        msgColor = this.getAppParam(context, 'COLOR', 'ValidationMessage'),
        bgColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'ValidationView'),
        separatorColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'Seperator')) {

        this.setInlineControlError(context, control, message, msgColor, bgColor, separatorColor);

        //check control is ControlProxy or not
        if (control.applyFormCellValidation) {
            return control.applyFormCellValidation();
        } else if (control.hasOwnProperty('context')) {
            return control.context.clientAPI.applyValidation();
        } else {
            return control.applyValidation();
        }
    }

    /**
     * this method similar to executeInlineControlError, but it only sets the inline, without applying it.
     * @param {*} control
     * @param {*} message
     * @param {*} msgColor
     * @param {*} bgColor
     * @param {*} separatorColor
     */
    static setInlineControlError(context, control, message,
        msgColor = this.getAppParam(context, 'COLOR', 'ValidationMessage'),
        bgColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'ValidationView'),
        separatorColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'Seperator')) {
        if (IsAndroid(context)) {
            msgColor = this.getAppParam(context, 'COLOR', 'ValidationMessageAndroid');
            separatorColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'ValidationViewAndroid');
            msgColor = this.getAppParam(context, 'BACKGROUNDCOLOR', 'SeperatorAndroid');
        }
        control.setValidationProperty('ValidationMessage', message);
        control.setValidationProperty('ValidationViewIsHidden', false);
        control.setValidationProperty('ValidationMessageColor', msgColor);
        control.setValidationProperty('SeparatorIsHidden', false);
        if (!IsAndroid(context)) {
            control.setValidationProperty('ValidationViewBackgroundColor', bgColor);
            control.setValidationProperty('SeparatorBackgroundColor', separatorColor);
        }
    }

    /**
     * this method only changing the visibility state of the control, does not include applyValidation()/redraw()
     * @param {IControlProxy} control
     * @param {boolean} isVisible
     */
    static setInlineControlErrorVisibility(control, isVisible) {
        control.setValidationProperty('ValidationViewIsHidden', !isVisible);
    }

    /**
     *
     * @param {*} context
     * @param {*} entity
     */
    static getLongText(entity) {
        if (entity && entity.length > 0) {
            return entity[0].TextString.replace(/^.*\n+/g, '');
        } else {
            return '';
        }
    }

    /**
     * Determines if the entity is local or not. Requires entity to be
     * @param {*} entity
     * @return {Boolean}
     */
    static isEntityLocal(entity) {
        if (entity && entity.hasOwnProperty('@odata.readLink')) {
            return libThis.isCurrentReadLinkLocal(entity['@odata.readLink']);
        }
        return undefined;
    }


    static getEntitySetName(context) {
        let entityODataType = context.binding['@odata.readLink'];
        if (entityODataType === undefined) {
            entityODataType = context.binding.getItem(0)['@odata.readLink'];
         }
        let entity = entityODataType.substring(0, entityODataType.indexOf('('));
        entity = entity.replace('/', '');
        return entity;

    }

    static navigateOnRead(context, navAction, readLink = context.getBindingObject()['@odata.readLink'], queryOption = '') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], queryOption).then(result => {
            if (!libVal.evalIsEmpty(result)) {
                if (context.setActionBinding)
                    context.setActionBinding(result.getItem(0));
                else
                    context.getPageProxy().setActionBinding(result.getItem(0));
                return context.executeAction(navAction).then((NavResult) => {
                    return NavResult;
                });
            } else {
                return Promise.resolve(false);
            }
        });
    }

    /**
     * Used for caching a dictionary of values with a key for quick lookup on list screens.
     * Dictionary is stored on list screen's client data.
     * @param {Object} context - Proxy used for reading the OData store
     * @param {String} entitySet - Name of the entity to be read from OData, and will also be used for dictionary name when stored in cacheStore
     * @param {String} queryOptions - Query options for the OData read
     * @param {Array} keyPropertyArray - Array of OData Column names that will act as dictionary key for later lookups
     * @param {Array} propertyArray - Array of column names to be stored in dictionary for later lookup.  Entire row will be saved if this optional parameter is missing
     * @param {Object} cacheStore - Client data object where data should be cached.  Will be pulled from current page if this optional parameter is missing
     */
    static cacheEntity(context, entitySet, queryOptions, keyPropertyArray, propertyArray, cacheStore) {
        try {
            //Get clientData from current page if it was not passed in
            cacheStore = cacheStore || context.getPageProxy().getClientData();
            if (!cacheStore[entitySet]) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(results => {
                    if (results.length > 0) {
                        if (!cacheStore[entitySet]) {
                            let dictionary = {};
                            //Loop over entity rows
                            results.forEach(function(element) {
                                let object = {};
                                //Loop over properties to store, or save entire row if no specific properties specified
                                if (propertyArray) {
                                    propertyArray.forEach(function(property) {
                                        if (element.hasOwnProperty(property)) {
                                            object[property] = element[property];
                                        }
                                    });
                                } else {
                                    object = element;
                                }
                                //Construct the cache key, supporting multiple columns
                                let keys = '';
                                keyPropertyArray.forEach(function(key) {
                                    if (element.hasOwnProperty(key)) {
                                        keys += element[key];
                                    }
                                });
                                dictionary[keys] = object;
                            });
                            cacheStore[entitySet] = dictionary;
                        }
                    }
                    return Promise.resolve();
                });
            } else {
                return Promise.resolve();
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `cacheEntity error: ${err}`);
            return Promise.resolve();
        }
    }

    /**
     * Retrieve a value from a cached dictionary.  Dictionary will be created first if it does not exist
     * @param {Object} context - Proxy used for reading the OData store
     * @param {String} entitySet - Name of the entity to be read from OData, and will also be used for dictionary name when stored in cacheStore
     * @param {String} keyValue - Data to be looked up in dictionary
     * @param {String} returnProperty - Column data to be returned to caller after the dictionary row is looked up using keyValue parameter
     * @param {String} queryOptions - Query options for the OData read
     * @param {Array} keyPropertyArray - Array of OData Column names that will act as dictionary key for later lookups
     * @param {Array} propertyArray - Array of column names to be stored in dictionary for later lookup.  Entire row will be saved if this optional parameter is missing
     * @param {Object} cacheStore - Object where data should be cached.  Will be pulled from current page if this optional parameter is missing
     */
    static getValueFromCache(context, entitySet, keyValue, returnProperty, queryOptions, keyPropertyArray, propertyArray, cacheStore) {
        try {
            //Get clientData from current page if it was not passed in
            cacheStore = cacheStore || context.getPageProxy().getClientData();
            if (!cacheStore[entitySet]) {
                return libThis.cacheEntity(context, entitySet, queryOptions, keyPropertyArray, propertyArray, cacheStore).then(() => {
                    try {
                        return cacheStore[entitySet][keyValue][returnProperty];
                    } catch (error) {
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), error.message + error.stack);
                        return '';
                    }
                });
            } else {
                return Promise.resolve(cacheStore[entitySet][keyValue][returnProperty]);
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `getValueFromCache error: ${err}`);
            return Promise.resolve('');
        }
    }

    /**
     * Clear out a state variable by name stored in client data
     * @param {Object} context - Proxy used to load the client data object if not provided
     * @param {String or Array} keys - Either a single string or an array of strings to be cleared from client data
     * @param {Object} clientData - Optional. Default client data page will be used if not provided
     * @param {Object} deleteKeys - Optional. Also delete the key properites itself from clientData. Default is false.
     */
    static clearFromClientData(context, keys, clientData, deleteKeys=false) {
        if (!clientData) {
            const pageName = libPersona.getPersonaOverviewStateVariablePage(context);
            try {
                let page = context.evaluateTargetPath('#Page:' + pageName);
                clientData = page.context.clientData;
            } catch (err) {
                return false;
            }
        }
        if (keys) {
            //If single string passed in, convert to array before processing
            if (typeof keys === 'string') {
                keys = [keys];
            }
            if (Array.isArray(keys)) {
                for (var index = 0; index < keys.length; index++) {
                    if (clientData.hasOwnProperty(keys[index])) {
                        clientData[keys[index]] = undefined;
                        if (deleteKeys) {
                            delete clientData[keys[index]];
                        }
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clear out a state variable by name stored in client data
     * @param {Object} pageProxy - Proxy used to load the client data object if not provided
     */

    static clearDocDataOnClientData(pageProxy) {
        libThis.clearFromClientData(pageProxy, 'DocDescription');
        libThis.clearFromClientData(pageProxy, 'Doc');
        libThis.clearFromClientData(pageProxy, 'Class');
        libThis.clearFromClientData(pageProxy, 'ObjectKey');
        libThis.clearFromClientData(pageProxy, 'entitySet');
        libThis.clearFromClientData(pageProxy, 'parentEntitySet');
        libThis.clearFromClientData(pageProxy, 'parentProperty');
        libThis.clearFromClientData(pageProxy, 'attachmentCount');
    }

    static shouldDisplayPriorityIcon(context, priority) {
        if (priority < 3 || priority === '*') {
          return  IsAndroid(context) ? '/SAPAssetManager/Images/high_priority_icon.android.png': '/SAPAssetManager/Images/high_priority_icon.png';
        }
        return '';
    }

    /**
     * previous name was getParentReadLink
     * @param {IPageProxy} context - Page Context to use
     * @param {String} entityPath - Navigation Link path to parent (i.e. /Item/Notification from Notification Item Activity)
     * @param {String} propertyName - the property name of the value that you want to return
     */

    static getEntityProperty(context, entityPath, propertyName) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entityPath, [], '').then(function(value) {
            value = value.getItem(0);
            return value[propertyName];
        });
    }

    /**
     * enable or disable a tool bar
     * @param {IPageProxy} context - Page Context to use
     * @param {String} pageName - Page name to use
     * @param {String} toolBarName - Toolbar name to be enabled
     * @param {String} flag - Boolen flag to enable or disable
     */
    static enableToolBar(context, pageName, toolBarName, flag) {
        try {
            let pageToolbar;
            if (pageName) {
                let page = context.evaluateTargetPath('#Page:' + pageName);
                pageToolbar = page.getToolbar();
            } else if (context._page) {
                pageToolbar = context._page.getToolbar();
            }
            if (pageToolbar) {
                return pageToolbar.then(function(toolbar) {
                    var toolbarItems = toolbar.getToolbarItems();
                    for (let i = 0; i < toolbarItems.length; i++) {
                        if (toolbarItems[i].name === toolBarName) {
                            toolbarItems[i].setEnabled(flag);
                        }
                    }
                    return Promise.resolve();
                });
            }
        } catch (exc) {
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `Can't enable toolbar on page ${pageName}`);
            return Promise.resolve();
        }
        return Promise.resolve();
    }

    /**
     * Format number to 2 decimal places, dropping zeros
     */
    static toTwoPlaces(context, number) {
        return context.formatNumber(number,null,{maximumFractionDigits:2});
    }

    /**
     * @param {String} readLink OData ReadLink to parse
     * @param {String?} value Value to pull from the ReadLink, if there is more than one parameter present
     * @returns {String} value of the key specified by `value` from the provided ReadLink
     */
    static parseReadLink(readLink, value) {
        var components = readLink.match(/([A-z]+=)?'[0-9]+'/g);
        var obj = {};
        if (components) {
            if (components.length > 1) {
                for (var idx in components) {
                    var tmp = components[idx].split('=');
                    obj[tmp[0]] = tmp[1].replace(/'/g, '');
                }
                return obj[value];
            } else {
                return components[0].replace(/'/g, '');
            }
        } else {
            return '';
        }
    }

    /**
     * Return the error string from an action result
     * @param {String} key Key used in the action result metadata
     */
    static getActionResultError(context, key) {
        let targetPath = '#ActionResults:' + key + '/#Property:error';
        let errorString = context.evaluateTargetPath(targetPath);
        // Remove error code and 'Error Descrition" from the message string
        let error = errorString.message.replace(/\[(.*)\]\s*/g, '').replace(/Error description:\s*/g, '');
        return error;
    }


    /*
    * Saves the binding object
    * Workaround for Action binding issue
    * 
    * @deprecated Use function {@link }setBindingObject(context) instead.
    */
    static SetBindingObject(context) {
        this.setStateVariable(context, 'BINDINGOBJECT', context.binding);
    }

    /*
    * returns the binding object saved to the overview page
    * @deprecated Use function {@link }getBindingObject(context) instead.
    */
    static GetBindingObject(context) {
        return this.getStateVariable(context, 'BINDINGOBJECT');
    }

    /**
     * Finds the binding object from context and saves it to clientData using key BINDINGOBJECT.
     * @param {*} context Any type of context page, or proxy.
     * @returns bindingObj if one is found. Undefined if not binding object was found.
     */
    static setBindingObject(context) {
        let bindingObj = context.binding;
        
        //Check if being called from context menu swipe
        if (context.constructor.name === 'SectionedTableProxy' && context.getPageProxy().getExecutedContextMenuItem()) {
            bindingObj = context.getPageProxy().getExecutedContextMenuItem().getBinding();
        }

        if (this.isDefined(bindingObj)) {
            this.setStateVariable(context, 'BINDINGOBJECT', bindingObj);
            return bindingObj;
        }

        return undefined;
    }

    /**
     * If context has the binding object, use it first. Otherwise, retrieve it from what was previously saved in client data. If nothing was saved, then use setBindingObject(context) first next time.
     * @param {*} context Any type of context page, or proxy.
     * @returns The binding object or undefined if nothing was previously saved or nothing was found in context.
     */
    static getBindingObject(context) {
        let bindingObj = context.binding;

        /**
         * In certain scenarios like setting WO status to hold from a context menu swipe, bindingObj is SimplePropertyCollectionSectionDefinition
         * which is not what we're looking for so we have to check if we’re coming from a context menu swipe first. If so, we want to retrieve the
         * previously saved binding object from setBindingObject(context).
         */        
        if (this.isDefined(bindingObj) && !this.isDefined(this.getStateVariable(context, 'contextMenuSwipePage'))) {
            return bindingObj;
        }

        return this.getStateVariable(context, 'BINDINGOBJECT');
    }

    /**
     * Removes the binding object.
     * @param {*} context Any type of context page, or proxy.
     * @returns nothing.
     */
    static removeBindingObject(context) {
        return this.removeStateVariable(context, 'BINDINGOBJECT');
    }

    /**
     *
     * @param {Context} context Current MDK Context
     * @param {String} action Action to be called, iterating over each element in `pickerItems`
     * @param {Array<Any>} pickerItems Array of elements to be iterated over. Stored in context.binding.Item
     *
     * Example Rule (assuming `pickerItems` was populated via `context.evaluateTargetPath('#Control:EquipmentPicker/#Value');`)
     ```
     {
         "Properties":
         {
             "DismantleEquip": "{{#Property:EquipId}}",
             "DismantleDate": "/SAPAssetManager/Rules/DateTime/CurrentDateTime.js",
             "DismantleTime": "/SAPAssetManager/Rules/DateTime/CurrentTime.js"
         },
         "Target":
         {
             "EntitySet": "MyEquipments",
             "Service": "/SAPAssetManager/Services/AssetManager.service",
             "ReadLink": "MyEquipments('{{#Property:Item/#Property:ReturnValue}}')"
         },
         "_Type": "Action.Type.ODataService.UpdateEntity"
     }
     ```
     */
    /*
    * returns the binding object saved to the overview page
    */
    /*
    * returns the binding object saved to the overview page
    */
    static CallActionWithPickerItems(context, action, pickerItems) {
        if (pickerItems.length > 0) {
            let newBinding = context.binding;

            newBinding.Item = pickerItems.shift();
            context.setActionBinding(newBinding);

            return context.executeAction(action).then(() => {
                return this.CallActionWithPickerItems(context, action, pickerItems);
            });
        } else {
            return Promise.resolve();
        }
    }

    /**
    * Describe this function...
    */
    static getControlValue(control) {
        if (control != null) {
            let value = control.getValue();
            if (Array.isArray(value)) {
                return libThis.getListPickerValue(value);
            } else {
                return value;
            }
        }
        return '';
    }

    /**
     * Checks to see if a parameter value is enabled by testing to see if its equal to Y, YES, T, or TRUE case-insensitively.
     * Returns false if parameter is not found or its value is blank.
     * @param {*} string
     */
    static isAppParameterEnabled(context, paramGroup, paramName) {
        let value = this.getAppParam(context, paramGroup, paramName);
        if (value && value !== '') {
            value = value.toUpperCase();
            if (value === 'Y' || value === 'T' || value === 'YES' || value === 'TRUE') {
                return true;
            }
        }
        return false;
    }

    /**
     * Saves initial values of a Form page in the page's client data
     * @param {*} string
     */
    static saveInitialValues(context) {
        setTimeout(function() {
            let clientData = context.getClientData();
            let controls = libThis.getControlDictionaryFromPage(context);
            var valueString = '';
            Object.keys(controls).forEach(key => {
                let control = controls[key];
                valueString += libThis.getControlValue(control);
            });
            clientData.controlDefaults = {};
            clientData.controlDefaults.valueString = valueString;
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Start Values:' +  valueString);
        }, 200);
    }

    /**
     * Checks if current values in a form page are same or different from the initial values.
     * @param {*} string
     */
    static unsavedChangesPresent(context) {
        let clientData = context.getClientData();
        let controls = libThis.getControlDictionaryFromPage(context);
        var valueString = '';
        Object.keys(controls).forEach(key => {
            let control = controls[key];
            valueString += libThis.getControlValue(control);
        });
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), 'Final Values:' +  valueString);
        if (!libThis.isDefined(clientData.controlDefaults)) {
            return true;
        } else {
            return (clientData.controlDefaults.valueString !== valueString);
        }
    }

    /**
     * Converts a duration in minutes to a TimeStamp format of the form PT00H00M00S
     */
    static minutesToTimeStamp(minutes) {
        if (libVal.evalIsEmpty(minutes) || isNaN(minutes) || minutes < 0 || minutes > 1440) {
            return 'PT00H00M00S';
        } else {
            let hour = ('0' + Math.floor(minutes / 60)).slice(-2);
            let min = ('0' + minutes % 60).slice(-2);
            return 'PT' + hour + 'H' + min + '00S';
        }

    }

    /**
     * Checks if a string is numeric or not.
     * @param {*} num
     */
    static isNumeric(num) {
        return !isNaN(num);
    }

    /**
     * Removes leading zeros from a string that is numeric.
     * @param {*} numberStr
     */
    static removeLeadingZeros(numberStr) {
        if (this.isDefined(numberStr)) {
            if (this.isNumeric(numberStr)) {
                //To automatically removes leading zeros from numberStr
                return parseInt(numberStr).toString();
            }
        }
        return numberStr;
    }

    static isInitialSync(context) {
        return ApplicationSettings.getBoolean(context, 'initialSync', true);
    }

    static setInitialSync(context) {
        return ApplicationSettings.setBoolean(context, 'initialSync', false);
    }

    static isApplicationLaunch(context) {
        return ApplicationSettings.getBoolean(context, 'applicationLaunch', false);
    }

    static setApplicationLaunch(context, flag) {
        return ApplicationSettings.setBoolean(context, 'applicationLaunch', flag);
    }

    /**
     * Returns a date from a date time string
     * @param {String} dateString
     * @return {Date}
     */
     static dateStringToUTCDatetime(dateString) {
        //example 2018-02-04T00:00:00
        var dateParts = dateString.split('-');
        // exmpl 04T00:00:00 -> 04
        var day = (dateParts[2].split('T'))[0];
        var date = new Date(dateParts[0], dateParts[1] - 1, day);
        return date;
    }
    /**
     * Returns a formatted date
     * @param {*} dateTime
     * @return {String}
     */
    static getFormattedDate(dateTime, clientAPI) {
    /*   let month = dateTime.getMonth() + 1;
        if (Number(month) < 10) month = '0' + month;
        let day = dateTime.getDate();
        if (Number(day) < 10) day = '0' + day;
        let year = dateTime.getFullYear();
        return year + '.' + month + '.' + day;
    */
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        
        var dateText = '';
 
        if (dateTime.toDateString() === today.toDateString()) {
            dateText = clientAPI.localizeText('today');
        } else if (dateTime.toDateString() === tomorrow.toDateString()) {
            dateText = clientAPI.localizeText('tomorrow');
        } else {
            dateText = clientAPI.formatDate(dateTime);
        }
           
        return dateText; 

    }

    static getVendorName(clientAPI, vendorId) {
        var queryOption = "$filter=Vendor eq '" + vendorId + "'";
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'Vendors', [], queryOption).then((result) => {
            if (result && result.length > 0) {
                return result.getItem(0).Vendor + ' - ' + result.getItem(0).Name1;
            } else {
                return vendorId;
            }
        });
    }

    static getPlantName(clientAPI, plantId) {
        var queryOptions = "$filter=Plant eq '" + plantId + "'" ;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], queryOptions).then((result) => {
            if (result && result.length > 0) {
                return result.getItem(0).Plant + ' - ' + result.getItem(0).PlantDescription;	
            }
            return plantId;
        });
    }

    static getStorageLocationName(clientAPI, plantId, storageLocationId) {
        var queryOptions = "$filter=Plant eq '" + plantId + "' and StorageLocation eq '" + storageLocationId + "'" ;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'StorageLocations', [], queryOptions).then((result) => {
            if (result && result.length > 0) {
                return result.getItem(0).StorageLocation + ' - ' + result.getItem(0).StorageLocationDesc;	
            }
            return storageLocationId;
        });
    }

    static getCustomerName(clientAPI, customerId) {
        var queryOptions = "$filter=Customer eq '" + customerId + "'" ;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'Customers', [], queryOptions).then((result) => {
            if (result && result.length > 0) {
                return result.getItem(0).Name1;	
            }	else {
                return customerId;
            }
        });
    }
  
    static clearValidationOnInput(context) {
        if (!context._control._validationProperties.ValidationViewIsHidden) {
            context.clearValidationOnValueChange();
        }
    }

    static getPlantFromWorkCenter(clientAPI, externalWorkCenterId) {
        let plant = '';

        if (externalWorkCenterId) {
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', ['PlantId'], `$filter=ExternalWorkCenterId eq '${externalWorkCenterId}'`).then((workCenterArray) => {
                if (workCenterArray.length > 0) {
                    plant = workCenterArray.getItem(0).PlantId;
                }
                return plant;
            });
        }

        return plant;
    }

    static oneLineAddress(address) {
        return `${address.HouseNum} ${address.Street}, ${address.City}, ${address.Region} ${address.PostalCode} ${address.Country}`;
    }

    static buildActivityTypeQueryOptions(context, workCenter) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.addExtra('ActivityType asc');

        let activityType = libThis.getExpenseActivityType(context);

        if (!libVal.evalIsEmpty(activityType)) {
            queryBuilder.addFilter(`ActivityType eq '${activityType}'`);
        }

        if (!libVal.evalIsEmpty(workCenter)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', ['CostCenter', 'ControllingArea'], `$filter=ExternalWorkCenterId eq '${workCenter}' and ObjectType eq 'A'`).then(function(result) {
                if (!libVal.evalIsEmpty(result)) {
                    if (!libVal.evalIsEmpty(result.getItem(0).CostCenter)) {
                        queryBuilder.addFilter(`CostCenter eq '${result.getItem(0).CostCenter}'`);
                    }
                    if (!libVal.evalIsEmpty(result.getItem(0).ControllingArea)) {
                        queryBuilder.addFilter(`ControllingArea eq '${result.getItem(0).ControllingArea}'`);
                    }
                }

                return queryBuilder.build();
            });
        }

        return queryBuilder.build();
    }

    static isOnlineServiceInitialized(context) {
        let provider = context.getODataProvider('/SAPAssetManager/Services/OnlineAssetManager.service');
        return provider.isInitialized();
    }

    static sleep(ms) {
        return (new Promise((resolve) => {
            setTimeout(function() {
                resolve();
            }, ms);
        }));
    }

    /* 
    If a date outside of the 14 day range is selected then a ConfirmationOverviewRow will need to be created to display time records
    */
    static createOverviewRow(context, newDate) {
        let oDataDate = new ODataDate(newDate);
        let dateQuery = oDataDate.queryString(context, 'date');
        let dateFilter = `$filter=PostingDate eq ${dateQuery}`;
    
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ConfirmationOverviewRows', [], dateFilter).then(overviewRow => {
            if (libVal.evalIsEmpty(overviewRow)) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationOverviewRowCreate.action',
                    'Properties': {
                        'Properties': {
                            'PostingDate': oDataDate.toLocalDateString(),
                        },
                    },
                }).then(() => {
                    return Promise.resolve(dateFilter);
                });
            }
    
            return Promise.resolve(dateFilter);
        });
    }
    
}
