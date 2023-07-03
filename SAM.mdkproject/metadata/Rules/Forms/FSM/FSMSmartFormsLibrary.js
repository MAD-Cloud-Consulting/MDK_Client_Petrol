import libThis from './FSMSmartFormsLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import * as xmlModule from '@nativescript/core/xml';
import Logger from '../../Log/Logger';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import Base64Library from '../../Common/Library/Base64Library';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import {v4 as uuidv4} from 'uuid';
import * as fs from '@nativescript/core/file-system';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';
import IsAndroid from '../../Common/IsAndroid';
import { GlobalVar } from '../../Common/Library/GlobalCommon';

/* 
* Contains all of the FSM Smartforms Feature related functions
*/
export default class {
    constructor() {
        this.controlId = '';
        this.userValues = new Map();
        this.chapter = {};
        this.field = {};
        this.temp = '';
        this.translatedFields = new Map();
        this.values = new Map();
        this.visibilityRules = {};
        this.chapters = [];
        this.metadata = new Map();
        this.langaugeCode = 'en';
        this.parseMetadata = (event) => {
            switch (event.eventType) {
                case xmlModule.ParserEventType.StartElement:
                    if (event.elementName === 'Language') {
                        this.metadata.set(event.position.line, this.langaugeCode);
                    }
                    break;
                case xmlModule.ParserEventType.Text: {
                    if (this.metadata.has(event.position.line)) {
                        const significantText = event.data.trim();
                        if (!ValidationLibrary.evalIsEmpty(significantText)) {
                            this.metadata[event.position.line] = significantText;
                            this.langaugeCode = significantText;
                        }   
                    }
                    break;
                }
                default:
                    break;
            }
        };

        /* Method to parse values-1.xml file */
        this.parseValues = (event) => {
            switch (event.eventType) {
                case xmlModule.ParserEventType.StartElement:
                    if (event.attributes) {
                        for (const attributeName in event.attributes) {
                            if (event.attributes[attributeName].includes('chapter')) {
                                const strs = event.attributes[attributeName].split('.');
                                this.controlId = strs[strs.length - 2];
                                if (this.controlId.includes('stateElement')) {
                                    this.controlId = this.controlId + strs[strs.length - 1];
                                }
                            }
                        }
                    }

                    break;
                case xmlModule.ParserEventType.Text: {
                    const significantText = event.data.trim();
                    if (!this.userValues.has(this.controlId)) this.userValues.set(this.controlId, significantText);
                    break;
                }
                default:
                    break;
            }
        };
        /* Method to parse translation.xml file */
        this.parseTranslation = (event) => {
            switch (event.eventType) {
                case xmlModule.ParserEventType.StartElement: {
                    if (event.attributes) {
                        for (const attributeName in event.attributes) {
                            if (event.attributes[attributeName].includes('chapter')) {
                                const strs = event.attributes[attributeName].split('.');
                                this.temp = strs[strs.length - 2];
                            }
                        }
                    }
                    break;
                }
                case xmlModule.ParserEventType.Text: {
                    const significantText = event.data.trim();
                    if (this.translatedFields.has(this.temp)) this.values.set(this.temp, significantText);
                    else if (!this.translatedFields.has(this.temp) && significantText !== '') {
                        this.translatedFields.set(this.temp, significantText);
                    }

                    break;
                }
                default:
                    break;
            }
        };
        /* Method to parse template.xml file */
        this.parseTemplate = (event) => {
            const validControlTypes = libThis.getSupportedSmartformControls();
            switch (event.eventType) {
                case xmlModule.ParserEventType.StartElement:
                    if (event.attributes) {
                        for (const attributeName in event.attributes) {
                            if (event.elementName === 'chapter' && attributeName === 'elementID') {
                                let subChapter = (event.attributes[attributeName].match(/_/g) || []).length > 1; //If chapter name has 2 or more '_', it is a sub-chapter
                                this.chapter = {
                                    chapterName: this.translatedFields.get(event.attributes[attributeName]),
                                    fields: [],
                                    elementID: event.attributes[attributeName],
                                    visibilityCondition: event.attributes.visibilityCondition,
                                    isSubChapter: subChapter,
                                };
                                this.chapters.push(this.chapter);
                                if (this.chapter.visibilityCondition) {
                                    let rule = libThis.convertToJsSyntax(this.chapter.visibilityCondition); //Convert operators to JavaScript syntax
                                    this.visibilityRules[this.chapter.elementID] = {IsChapter: true, IsSubChapter: subChapter, Rule: rule};
                                }
                            } else if (event.elementName === 'dropdown') {
                                if (attributeName === 'elementID') {
                                    this.field = {
                                        type: 'dropdown',
                                        name: this.translatedFields.get(event.attributes[attributeName]),
                                        value: [],
                                        options: [],
                                        selectedIndex: event.attributes.selectedIndex,
                                        elementID: event.attributes[attributeName],
                                        readOnly: event.attributes.readOnly,
                                        required: event.attributes.required,
                                        visibilityCondition: event.attributes.visibilityCondition,
                                    };
                                }
                            } else if (event.elementName === 'option' && attributeName === 'elementID') {
                                //this.field.options.push(this.translatedFields.get(event.attributes[attributeName]));
                                this.field.options.push({Index: this.field.options.length, ReturnValue: event.attributes[attributeName], DisplayValue: this.translatedFields.get(event.attributes[attributeName])});
                            } else if (attributeName === 'elementID' && event.elementName !== 'chapter' && !this.field.hasOwnProperty('type')) {
                                this.field = {
                                    type: event.elementName,
                                    name: this.translatedFields.get(event.attributes[attributeName]),
                                    value: '',
                                    elementID: event.attributes[attributeName],
                                    multiline: event.attributes.multiline,
                                    readOnly: event.attributes.readOnly,
                                    required: event.attributes.required,
                                    allowBarcode: event.attributes.allowBarcode,
                                    min: event.attributes.min,
                                    max: event.attributes.max,
                                    minDecimals: event.attributes.minDecimals,
                                    maxDecimals: event.attributes.maxDecimals,
                                    allowOutOfRangeValues: event.attributes.allowOutOfRangeValues,
                                    visibilityCondition: event.attributes.visibilityCondition,
                                    coreType: event.attributes.type,
                                    selectedIndex: event.attributes.selectedIndex, //stateElement
                                };
                            } else if (event.elementName === 'attachment') {
                                this.field[attributeName] = event.attributes[attributeName];                              
                            }
                            if (this.field.hasOwnProperty('type') && attributeName === 'elementID' && this.field.type !== 'dropdown') {
                                this.field.name = this.translatedFields.get(event.attributes[attributeName]);
                            }
                        }
                    }
                    break;
                case xmlModule.ParserEventType.EndElement: {
                    if (event.elementName === 'dropdown') {
                        this.chapters[this.chapters.length - 1].fields.push(this.field);
                        if (this.field.visibilityCondition) {
                            let rule = libThis.convertToJsSyntax(this.field.visibilityCondition); //Convert operators to JavaScript syntax
                            this.visibilityRules[this.field.elementID] = {IsChapter: false, IsSubChapter: false, Rule: rule};
                        }
                        this.field = {};
                    }
                    break;
                }
                case xmlModule.ParserEventType.Text: {
                    const significantText = event.data.trim();
                    if (this.chapters.length > 0 && this.field.hasOwnProperty('type') && this.field.type !== 'dropdown') {
                        this.field.value = significantText;
                        this.chapters[this.chapters.length - 1].fields.push(this.field);
                        if (this.field.visibilityCondition) {
                            if (validControlTypes[this.field.type]) { //Ignore non-supported control types
                                let rule = libThis.convertToJsSyntax(this.field.visibilityCondition); //Convert operators to JavaScript syntax
                                this.visibilityRules[this.field.elementID] = {IsChapter: false, IsSubChapter: false, Rule: rule};
                            }
                        }
                        this.field = {};
                    }
                    break;
                }
                default:
                    break;
            }
        };
        this.onErrorCallback = (error) => {
            Logger.error('FSMForm', `Error: ${error.message}`);
        };
    }
    /**
     * Is the FSM Smartforms feature enabled in the backend? 
     * @param {*} context 
     */
    static isFSMSmartFormsFeatureEnabled(context) {
        return (libPersona.isFieldServiceTechnician(context) && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FSMSmartForms.global').getValue()));

    }

    /**
     * Get query options to display smartforms for an operation
     * @param {*} context 
     * @param {*} useQueryBuilder 
     * @returns 
     */
    static getOperationFSMFormsQueryOptions(context, useQueryBuilder=true) {
        if (useQueryBuilder) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('Description,Id,CreatePerson,Content,Template,FSMFormTemplate_Nav/Description,FSMFormTemplate_Nav/Name,WorkOrder,Operation,Mandatory,Closed');
            queryBuilder.filter("(WorkOrder eq '" + context.binding.OrderId + "' and Operation eq '" + context.binding.OperationNo + "')");
            queryBuilder.expand('FSMFormTemplate_Nav');
            queryBuilder.orderBy('WorkOrder,Operation,Description');
            return queryBuilder;
        }
        return "$filter=(WorkOrder eq '" + context.binding.OrderId + "' and Operation eq '" + context.binding.OperationNo + "')";
    }

    /**
     * Get query options to display all smartforms
     * @param {*} context 
     * @param {*} useQueryBuilder 
     * @returns 
     */
    static getFSMFormsQueryOptions(context, useQueryBuilder=true) {
        if (useQueryBuilder) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('Description,Id,CreatePerson,Content,Template,FSMFormTemplate_Nav/Description,FSMFormTemplate_Nav/Name,WorkOrder,Operation,Mandatory,Closed');
            queryBuilder.expand('FSMFormTemplate_Nav');
            queryBuilder.orderBy('WorkOrder,Operation,Description');
            return queryBuilder;
        }
        return '';
    }

    /**
     * 
     * @returns Map of patterns to search/replace for visibility rules
     */
    static getOperatorReplaceMap() {
        return {
            '\\s(=)\\s': ' === ',
            '\\s(<>)\\s': ' != ',
            '\\bnot isblank\\(': '!checklist_function_isblank(',
            '\\bisblank\\(': 'checklist_function_isblank(',
            '\\s(and)\\s': ' && ',
            '\\s(or)\\s': ' || ',
        };
    }

    /**
     * Calculates visibility condition of provided element based on it's visibility condition expression and values of related elements
     *
     * @return true if visibility condition is true, false otherwise
     */
    static calculateElementVisibility(context, control, rule, values, elements) {
        let result;
        let jsStatement;
        let expression;

        expression = libThis.replaceElementsWithValues(context, control, elements, values, rule);
        if (expression.includes('checklist_function_isblank')) {
            jsStatement = '"use strict"; function checklist_function_isblank(input) { return input === undefined || input.length === 0; }; return ' + expression;
        } else {
            jsStatement = 'return ' + expression;
        }
        try {
            result = Function(jsStatement)();
        } catch (err) {
            result = true;
        }
        return result;
    }

    /**
     * Goes over provided string and replaces checklist visibility condition operators to JS syntax:
     * - AND -> &&
     * - OR -> ||
     * - NOT -> !
     * - ISBLANK -> checklist_function_isblank
     * - = -> ===
     * This method doesn't replace those operators if they appear in double quoted strings, i.e.:
     * - textInput1 = "test and more" and numberInput1 = 1 -> textInput1 = "test and more" && numberInput1 === 1
     *
     * @param rule the visibility condition string
     * @return replaced expression
     */

    static convertToJsSyntax(rule) {
        const quotesPattern = new RegExp('\"[^\"]+\"|([^\"]+)', 'g');
        const matcher = rule.match(quotesPattern);
        let newRule = '';

        for (const element of matcher) {
            if (element.search('\"') >= 0) { //this is string used to compare to element value - pass it as is
                newRule += element;
            } else {
                //this is part of expression syntax with operators and elements name, make it JS valid
                let jsSyntax = element.toLowerCase();
                let termsMap = libThis.getOperatorReplaceMap();
                for (const term in termsMap) { //Loop over all operator patterns that need to be replaced
                    let pattern = new RegExp(term,'ig');
                    let insideMatcher = jsSyntax.match(pattern);
                    if (insideMatcher) {
                        jsSyntax = jsSyntax.replace(pattern, termsMap[term]);
                    }
                }
                newRule += jsSyntax;
            }
        }     
        return newRule;
    }

    /**
     * Replaces element references to it's real values, i.e.:
     * - expression = numberInput1 = 1 OR numberInput2 = 2
     * Then having values:
     * - numberInput1 = 1
     * - numberInput2 = 3
     * the result expression will be
     * - 1 = 1 OR 3 = 2
     *
     * @return replaced expression
     */
    static replaceElementsWithValues(context, control, elements, values, expression) {
        let newRule = expression;
        
        for (const elementName in elements) {  //All controls that are part of visibility rules
            if (libThis.areRelatedInsideSeries(control, elementName)) {                
                newRule = libThis.replaceElementWithValue(context, newRule, elementName, values);
            }
        }
        return newRule;
    }

    /**
     * Replaces single element reference to it's real values, i.e.:
     * - expression = numberInput1 = 1 OR numberInput2 = 2
     * Then having values:
     * - numberInput1 = 1
     * - numberInput2 = 3
     * the result expression will be
     * - 1 = 1 OR numberInput2 = 2
     * This method uses Regex pattern to find exactly the referenced element name in the whole expression.
     *
     * @param expression the expression to replace
     * @param elementName the checklist element name
     * @param values dictionary of checklist element name/value pairs
     * @return replaced expression
     */
    static replaceElementWithValue(context, expression, elementName, values) {
        const pattern = new RegExp('\\b(' + elementName + ')\\b', 'ig');
        let matcher = expression.match(pattern);
        if (matcher) {
            let value = libThis.getValueFromElement(context, elementName, values);
            return expression.replace(pattern, value); //Matcher.quoteReplacement(value)?
        } else {
            return expression;
        }
    }

    /**
     * Returns value of element. In case it's TextInputChecklistElement it wraps the value with double quotes
     *
     * @param elementName the element for which take the value
     * @param values dictionary of checklist element name/value pairs
     * @return value as string or UNDEFINED_JS_KEY constant if value was null
     */
    static getValueFromElement(context, elementName, values) {

        let value = '';
        let control = libCom.getControlProxy(context, elementName, 'FormCellSectionedTable');

        if (control) { //This control exists on this page, so get the value from the page also
            if (control._control.type === 'Control.Type.FormCell.ListPicker') { //Smartforms use index, not the actual return value text for visibility rules
                let tempValue = control.getValue();
                if (Array.isArray(tempValue) && tempValue.length === 1 && tempValue[0].SelectedIndex >= 0) {
                    value = values[elementName].Options[tempValue[0].ReturnValue].Index;
                }
            } else {
                value = libCom.getControlValue(control);
            }
        } else { //Control is not on this page, so get it from control map
            if (values.hasOwnProperty(elementName)) {
                if (values[elementName].Type === 'dropdown') { //Look up the correct index for this drop down option
                    value = '';
                    if (values[elementName].Value) {
                        value = values[elementName].Options[values[elementName].Value].Index;
                    }
                } else {
                    value = values[elementName].Value;
                }
            }
        }
        if (!ValidationLibrary.evalIsEmpty(value)) {
            let controlType = values[elementName].Type;
            if (controlType === 'textinput' || controlType === 'note') {
                value = '\"' + libThis.convertNewLineToJsNewLine(value) + '\"';
            }
        } else {
            value = 'undefined';
        }
        return value;
    }

    /**
     * Examples:
     *
     * input from the user: "test"
     * java expression:
     * checklist_function_isblank("test")
     * result: OK
     *
     * input from the user: "test\ntest"
     * java expression:
     * checklist_function_isblank("test
     * test")
     * result: Invalid java script exception. Terminated string literal not found.
     *
     * Explanation:
     * In java script, if an expression is written on multiple lines the "\" should be used as a separator.
     * This method adds a "\" to any new line character from the user input.
     *
     * @param value - the value for which the new line should be processed.
     * @return a string which new line chars replaced with the new line used in JS.
     */
    static convertNewLineToJsNewLine(value) {
        let newLineMatch = new RegExp('\\n', 'g');
        return value.replace(newLineMatch, '\\\n');
    }

    /**
     * Checks if 2 elements are related if they are inside series in the scope of replacing an element from an expression with its value.
     *
     * @param element        - the condition host element.
     * @param relatedElement - the element to check if it is related.
     * @return true in case the elements are related in same series or they are not inside any series, false otherwise.
     */
     static areRelatedInsideSeries() {
         return true;
     }

    /**
     * Save the current smart form page's values to memory
     * @param {*} context 
     */
    static saveCurrentPageValues(context) {
        let pageControls = libCom.getControlDictionaryFromPage(context);
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let value;
        let promises = [];
        for (const control in pageControls) {
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                if (pageControls[control].visible) { //Only save value if control is visible
                    switch (savedControl.Type) {
                        case 'numberinput':
                        case 'textinput':
                        case 'note':
                        case 'boolinput':
                        case 'dropdown':
                            value = libCom.getControlValue(pageControls[control]);
                            if (this.getProperString(savedControl.Value).toString() !== this.getProperString(value).toString()) {
                                savedControl.NeedsXMLUpdate = true;
                            }
                            savedControl.Value = value;  
                            break;
                        case 'dateinput':
                            value = libCom.getControlValue(pageControls[control]);
                            if (this.getProperString(savedControl.Value) !== this.getProperString(value.toISOString())) {
                                savedControl.NeedsXMLUpdate = true;
                            }
                            savedControl.Value = value.toISOString();  
                            break;
                        case 'stateElement':
                            if (control.includes('value')) {
                                value = this.getStatusForMachinesIndex(libCom.getControlValue(pageControls[control]));
                                if (this.getProperString(savedControl.Value.Value).toString() !== this.getProperString(value).toString()) {
                                    savedControl.NeedsXMLUpdate = true;
                                }
                                savedControl.Value.Value = value;
                            } else {
                                value = libCom.getControlValue(pageControls[control]);
                                if (this.getProperString(savedControl.Value.Comment) !== this.getProperString(value)) {
                                    savedControl.NeedsXMLUpdate = true;
                                }
                                savedControl.Value.Comment = value;
                            }
                            break;
                        case 'signature':
                            if (!ValidationLibrary.evalIsEmpty(pageControls[control].getValue())) {
                                if (savedControl.FileContent !== pageControls[control].getValue().content) { //Is signature content different from previously saved?
                                    const signatureControl = pageControls[control];
                                    let fileContent = Base64Library.transformBinaryToBase64(IsAndroid(context), signatureControl.getValue().content);
                                    let guid = uuidv4();
                                    let objectId = context.getPageProxy().binding.Id;
                                    let objectType = 'CHECKLISTINSTANCE';
                                    if (this.ifMediaExist(savedControl.Value)) { 
                                        //Skip for now.  Add better solution later
                                        //promises.push(this.deleteLocalMedia(savedControl.Value));
                                    }
                                    promises.push(this.createMedia(context, fileContent, guid, savedControl, objectId, objectType, signatureControl));
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return Promise.all(promises).catch((err) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            context.getClientData().Error=context.localizeText('update_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
        });
    }

    /**
     * Validate required and numeric range fields for the current chapter
     * Set fields to display inline errors and prevent moving to another chapter
     * @param {*} context
     * @param {*} suppressErrors Do not display inline errors, only return success or failure 
     */
    static ValidateCurrentPageValues(context, suppressErrors=false) {

        if (context.getPageProxy().binding.Closed) return true; // pass all the validation if form is closed

        let pageControls = libCom.getControlDictionaryFromPage(context);
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let value;
        let validationSuccess = true;

        //Handle required fields
        for (const control in pageControls) {
            if (suppressErrors && !validationSuccess) break; //Do not process remaining controls if one has already failed
            if (pageControls[control]._control.hasOwnProperty('_validationProperties') && !pageControls[control]._control._validationProperties.ValidationViewIsHidden) { //Clear validation if it is shown currently
                pageControls[control].clearValidation();
            }
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                switch (savedControl.Type) {
                    case 'numberinput':
                    case 'textinput':
                    case 'note':
                    case 'boolinput':
                    case 'dropdown':
                    case 'dateinput':
                    case 'attachment':
                        value = libCom.getControlValue(pageControls[control]);
                        break;
                    case 'stateElement':
                        if (control.includes('value')) {
                            value = this.getStatusForMachinesIndex(libCom.getControlValue(pageControls[control]));
                        } else {
                            value = libCom.getControlValue(pageControls[control]);
                        }
                        break;
                    case 'signature': //Control value might be empty, so use the previously saved value
                        value = '';
                        if (!ValidationLibrary.evalIsEmpty(savedControl.Value) && libThis.isValidUUID(savedControl.Value)) {
                            value = savedControl.Value;
                        } else if (pageControls[control].getValue()) { //User just entered signature on this screen
                            value = pageControls[control].getValue();
                        }
                        break;
                    default:
                        break;
                }
                if (savedControl.Type === 'dateinput' && ValidationLibrary.evalIsEmpty(savedControl.Value) && savedControl.IsError && savedControl.IsVisible) {
                    //Date case will never be empty because MDK has no such concept, so we catch an empty date one time to alert user during submit
                    if (!suppressErrors) {
                        savedControl.IsError = false;
                        let message = context.localizeText('field_is_required');
                        libCom.setInlineControlError(context, pageControls[control], message);
                        pageControls[control]._control.context.clientAPI.applyValidation();
                    }
                    validationSuccess = false;
                } else if (savedControl.Required && ValidationLibrary.evalIsEmpty(value) && savedControl.IsVisible) { //Only mark required as error if field is visible
                    if (!suppressErrors) {
                        savedControl.IsError = true;
                        let message = context.localizeText('field_is_required');
                        libCom.setInlineControlError(context, pageControls[control], message);
                        pageControls[control]._control.context.clientAPI.applyValidation();
                    }
                    validationSuccess = false;
                } else {
                    savedControl.IsError = false;
                }
            }
        }
        //Handle numeric fields
        for (const control in pageControls) {
            if (suppressErrors && !validationSuccess) break; //Do not process remaining controls if one has already failed
            let savedControl = valueMap[this.getControlName(control)];
            if (savedControl) {
                if (!savedControl.IsError) { //This field was already flagged as mandatory, so skip it
                    if (savedControl.Type === 'numberinput' && !savedControl.AllowOutOfRangeValues && savedControl.IsVisible) { //Only mark as error if field is visible
                        value = libCom.getControlValue(pageControls[control]);
                        if (libLocal.isNumber(context, value)) { //Only validate if a number has been entered in field
                            if (!libThis.ValidateLowerRange(context, value, savedControl.Min)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_min', [savedControl.Min]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateUpperRange(context, value, savedControl.Max)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_max', [savedControl.Max]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateMinDecimals(context, value, savedControl.MinDecimals)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message = context.localizeText('forms_numeric_decimals_min', [savedControl.MinDecimals]);
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            } else if (!libThis.ValidateMaxDecimals(context, value, savedControl.MaxDecimals)) {
                                if (!suppressErrors) {
                                    savedControl.IsError = true;
                                    let message;
                                    if (savedControl.MaxDecimals === '0') {
                                        message = context.localizeText('forms_numeric_integer');
                                    } else {
                                        message = context.localizeText('forms_numeric_decimals_max', [savedControl.MaxDecimals]);
                                    }
                                    libCom.setInlineControlError(context, pageControls[control], message);
                                    pageControls[control]._control.context.clientAPI.applyValidation();
                                }
                                validationSuccess = false;
                            }
                        }
                    }
                }
            }
        }
        let chaptersArray = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
        let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;

        if (validationSuccess) { //Update the current chapter's state for progress extension
            if (chaptersArray[currentChapterIndex].state === 3) { //Error state = 3
                chaptersArray[currentChapterIndex].state = 0;
            }
        } else {
            chaptersArray[currentChapterIndex].state = 3; //Set to Error state
        }
        return validationSuccess;
    }

    /**
     * Validate required and numeric range fields for the current chapter during submit
     * @param {*} context
     * @param {*} chapterControls - array of control names for current chapter
     */
    static ValidateChapterValuesDuringSubmit(context, chapterControls) {
        let value;
        let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');

        //Handle required fields
        for (const control of chapterControls) {
            let savedControl = valueMap[control];
            savedControl.IsError = false;
            switch (savedControl.Type) {
                case 'numberinput':
                case 'textinput':
                case 'note':
                case 'boolinput':
                case 'dropdown':
                case 'dateinput':
                case 'signature':
                case 'attachment':
                    value = savedControl.Value;
                    break;
                case 'stateElement':
                    if (savedControl.Name.includes('value')) {
                        value = savedControl.Value.Value;
                    } else {
                        value = savedControl.Value.Comment;
                    }
                    break;
                default:
                    break;
            }
            if (savedControl.Required && ValidationLibrary.evalIsEmpty(value) && savedControl.IsVisible) { //Ignore if not visible
                savedControl.IsError = true;
                return false; //Validation failed
            }
        }

        //Handle numeric fields
        for (const control of chapterControls) {
            let savedControl = valueMap[control];
            if (savedControl.Type === 'numberinput' && !savedControl.AllowOutOfRangeValues && savedControl.IsVisible) { //Only mark as error if field is visible
                value = savedControl.Value;
                if (libLocal.isNumber(context, value)) {
                    if (!libThis.ValidateLowerRange(context, value, savedControl.Min)) {
                        savedControl.IsError = true;
                        return false;
                    } else if (!libThis.ValidateUpperRange(context, value, savedControl.Max)) {
                        savedControl.IsError = true;
                        return false;
                    } else if (!libThis.ValidateMinDecimals(context, value, savedControl.MinDecimals)) {
                        savedControl.IsError = true;
                        return false;
                    } else if (!libThis.ValidateMaxDecimals(context, value, savedControl.MaxDecimals)) {
                        savedControl.IsError = true;
                        return false;
                    }
                }
            }
        }
        return true; //All checks passed
    }

    /**
     * Validate that numeric value is >= defined lower range for smart form numeric field
     * @param {*} value 
     * @param {*} lowerRange 
     */
    static ValidateLowerRange(context, value, lowerRange) {
        if (libLocal.isNumber(context, lowerRange)) {
            return value >= libLocal.toNumber(context, lowerRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is <= defined upper range for smart form numeric field
     * @param {*} value 
     * @param {*} lowerRange 
     */
    static ValidateUpperRange(context, value, upperRange) {
        if (libLocal.isNumber(context, upperRange)) {
            return value <= libLocal.toNumber(context, upperRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is >= defined lower decimal range for smart form numeric field
     * @param {*} value 
     * @param {*} lowerRange 
     */
    static ValidateMinDecimals(context, value, lowerRange) {
        if (libLocal.isNumber(context, lowerRange)) {
            return libMeasure.evalPrecision(value) >= libLocal.toNumber(context, lowerRange);
        }
        return true;
    }

    /**
     * Validate that numeric value is <= defined upper decimal range for smart form numeric field
     * @param {*} value 
     * @param {*} lowerRange 
     */
    static ValidateMaxDecimals(context, value, upperRange) {
        if (libLocal.isNumber(context, upperRange)) {
            return libMeasure.evalPrecision(value) <= libLocal.toNumber(context, upperRange);
        }
        return true;
    }    

    /**
     * 
     * @param {*} context 
     * @returns 
     */
    static getFormActionBinding(context) {
        try {
            if (!ValidationLibrary.evalIsEmpty(context.getPageProxy().getActionBinding())) {
                return context.getPageProxy().getActionBinding();
            } else if (!ValidationLibrary.evalIsEmpty(context.getPageProxy().binding)) {
                return context.getPageProxy().binding;
            } else {
                return context.binding;
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            return context;
        }
    }

    /**
     * Get hardcoded machine status. They are not translated
     * https://help.sap.com/docs/SAP_FIELD_SERVICE_MANAGEMENT/fsm_smartforms/status.html?q=smartform
     * @returns 
     */
    static getStatusForMachines() {
        return ['OK', 'Needs attention', 'Spare parts', 'Readjusted', 'Not checked'];
    }

    /**
     * Get the actual FSM index for saving to XML
     * @param {*} status 
     * @returns 
     */
    static getStatusForMachinesIndex(status) {
        if (status) {
            return this.getStatusForMachines().indexOf(status);
        }
        return '';
    }

    /**
     * Redraw the previous and next buttons after a chapter's visibility has changed
     * @param {*} context 
     */
    static redrawToolbarButtons(context) {
        context._page.getToolbar().then((toolbar) => {
            let toolbarItems = toolbar.getToolbarItems();
            for (let i = 0; i < toolbarItems.length; i++) {
                if (toolbarItems[i].name === 'ToolbarItem0' || toolbarItems[i].name === 'ToolbarItem1') {
                    toolbarItems[i].redraw();
                }
            }
        });
    }

    /**
     * Set initial chapter visibility states so we can pass these to extension, and chapter selection picker
     * @param {*} context 
     * @returns 
     */
    static SetInitialChapterAndFieldVisibilityState(context, chapterArray) {

        let ruleMap = libCom.getStateVariable(context, 'FSMFormInstanceVisibilityRules');
        let fieldValues = libCom.getStateVariable(context, 'FSMFormInstanceControls');
        let elementsInRules = libCom.getStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules');

        for (const controlName in ruleMap) { //Loop over all rules        
            if (ruleMap[controlName].IsChapter) {
                let chapter = chapterArray[chapterArray.findIndex((row) => row.id === controlName)];
                let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                if (visible !== chapter.isVisible) {
                    chapter.isVisible = visible;
                    if (!chapter.isVisible) {
                        chapter.state = 4; //disabled
                    } else {
                        chapter.state = 0;
                    }
                }
            } else { //Handle regular fields.  Required so validation can later skip controls that are not visible
                let visible = libThis.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                fieldValues[controlName].IsVisible = visible;
            }
        }
    }
 
    /**
     * Get Control Name
     */
    static getControlName(controlName) {
        if (controlName.includes('stateElement')) {
            return controlName.split('.')[0];
        }
        return controlName;
    }

    /**
     * 
     * @param {*} page 
     * @param {*} valueMap 
     * @param {*} tempField 
     */
    static getMediaControl(page, valueMap, tempField) {
        const id = valueMap[tempField.elementID].Value.replace(/[^A-Za-z0-9]+/g, '');
        const readLink = valueMap[tempField.elementID].ReadLink || 'FSMFormAttachments(\'' + id + '\')';
        let imageValue = '/SAPAssetManager/Services/AssetManager.service/' + readLink  + '/$value';
        const imageLocalPath = fs.path.join(fs.knownFolders.temp().path, valueMap[tempField.elementID].Value);
        if (this.ifMediaExist(valueMap[tempField.elementID].Value)) { // if file exists, use the local copy
            imageValue = imageLocalPath;
        }
        let title = tempField.attachmentName || tempField.name || '';
        page.Controls[0].Sections.push({
            '_Type': 'Section.Type.Image',
            'Image': imageValue,
            'IsVisible': true,
            'Title':title,
        });
        page.Controls[0].Sections.push({
            '_Type': 'Section.Type.FormCell',
            'Controls': [],
        });
    }

    /**
     * Create XML for the values.xml file using key and existing form controls
     * @param {*} key 
     * @param {*} formControls 
     * @returns 
     */
    static createXMLString(key, formControls, formNameValueMap) {
        let xml = '';
        const lastChangedDateTime = 'last-changed-datetime=' + '"' + new Date().toISOString() + '"';
        const authorId = 'value-author-id=' + '"' + 'cloud(' + GlobalVar.getUserSystemInfo().get('FSM_EMPLOYEE') + ')' + '"';
        const value = formNameValueMap.get(key);
        let type = key.split('.')[1]; // For state element, key would be stateElement.value or stateElement.comment, saving the .value or .comment so we can resuse it 
        key = key.includes('stateElement') ? key.split('.')[0] : key;
        let chapterKey = 'key' + '=' + '"' + formControls[key].Chapter.id + '.' + formControls[key].Name + '.value' + '"' + '>';
        let startTag = '';
        let endTag = '';
        switch (formControls[key].Type) {
            case 'numberinput':
                startTag =  '<number';
                endTag = '</number>';
                break;
            case 'textinput':
            case 'note':
                startTag =  '<string';
                endTag = '</string>';
                break;
            case 'boolinput':
                startTag =  '<bool';
                endTag = '</bool>';
                break;
            case 'dropdown':
                startTag =  '<number';
                endTag = '</number>';
                break;
            case 'dateinput': 
                startTag =  '<datetime';
                endTag = '</datetime>';
                break;
            case 'signature': 
                startTag =  '<signature';
                endTag = '</signature>';
                break;
            case 'stateElement':
                if (type === 'value') {
                    startTag =  '<value';
                    endTag = '</value>';
                } else {
                    chapterKey = chapterKey.replace('.value', '.comment');
                    startTag =  '<string';
                    endTag = '</string>';
                }
                break;
            default: 
                break;
        }
        xml += startTag;
        xml += ' ' + lastChangedDateTime + ' ' + authorId + ' ' + chapterKey + value;
        xml += endTag;
        return xml;
    }

    /**
     * Check if the UUID is valid
     * @param {*} uuid 
     * @returns 
     */
    static isValidUUID(uuid) {
        let s = '' + uuid;
        s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return !(s === null);
    }

    /**
     * Save the locally created media on device temp storage
     * @param {*} context 
     * @param {*} control 
     */
    static saveMediaOnDevice(context, control) {
        var documentPath = fs.path.join(fs.knownFolders.temp().path, control.Value); // The value of the control is GUID and we are saving all the files using that
        var documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
        let content = control.FileContent;
        documentFileObject.writeSync(content, () => {
            context.getClientData().Error=context.localizeText('create_document_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
            throw new Error();
        });
        return Promise.resolve();
    }

    /**
     * Return a pointer to the progress tracker extension on the current smartform edit screen
     * @param {*} context 
     * @returns 
     */
    static getProgressExtensionControl(context) {
        return context.getPageProxy().getControl('FormCellSectionedTable').getSection('ProgressTrackerExtensionControl')._context.element._extensions[0];
    }

    /**
     * Check if media exists locally
     * @param {*} mediaID 
     * @returns 
     */
    static ifMediaExist(mediaID) {
        if (ValidationLibrary.evalIsEmpty(mediaID)) return false;
        const mediaLocalPath = fs.path.join(fs.knownFolders.temp().path, mediaID);
        return fs.File.exists(mediaLocalPath);
    }
    /**
     * Delete the local media before creating a new one
     * @param {*} mediaID 
     * @returns 
     */
    static deleteLocalMedia(mediaID) {
        if (ValidationLibrary.evalIsEmpty(mediaID)) return Promise.resolve();
        const mediaLocalPath = fs.path.join(fs.knownFolders.temp().path, mediaID);
        const mediaFile = fs.File.fromPath(mediaLocalPath);
        return mediaFile.remove();
    }

    /**
     * 
     * @param {*} context 
     * @param {*} fileContent 
     * @param {*} guid 
     * @param {*} savedControl 
     * @param {*} objectId 
     * @param {*} objectType 
     * @param {*} signatureControl 
     * @returns 
     */
    static createMedia(context, fileContent, guid, savedControl, objectId, objectType, signatureControl) {
        savedControl.Value = guid;
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMAttachmentCreate.action', 'Properties': {
            'Properties': {
                'DocumentId': guid,
                'FileContent': fileContent,
                'ObjectId': objectId,
                'ObjectType':objectType, 
                'FileName': guid,   
            },
            'Headers' : {
                'slug' : {
                    'DocumentId': guid,
                    'ObjectId': objectId,
                    'ObjectType':objectType, 
                    'FileName': guid,      
                },
            },
            'Target': {
                'EntitySet' : 'FSMFormAttachments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',

            },
            'Media': signatureControl.getValue(),
        }}).then((data) => {
            savedControl.ReadLink = data.data[0]; // save the readlink for next pass
            savedControl.FileContent = signatureControl.getValue().content;
            return this.saveMediaOnDevice(context, savedControl).then(() => {
                savedControl.NeedsXMLUpdate = true;
                return Promise.resolve();
            }).catch(() => {
                return Promise.reject();
            });
        });
    }

    /**
     * Take a string and send an empty string if the existing value is undefined.
     * For pickers, the initial values would be undefined if nothing is selected 
     * and we dont want to save that to xml
     * @param {*} value 
     */
    static getProperString(value) {
        return ValidationLibrary.evalIsEmpty(value) ? '' : value; 
    }
    /**
     * Take the prefix and path of the file and find if the file exist with
     * device locale and if not, use the language code from the metadata.xml
     * @param {*} context 
     * @param {*} path 
     * @param {*} prefix 
     * @returns file name with correct locale
     */
    static getLocalizeFileName(context, path, prefix) {
        const deviceLocalFile = prefix + '-' + context.getLanguage() + '.xml';
        const deviceLocalFilePath = fs.path.join(path, deviceLocalFile);
        if (fs.File.exists(deviceLocalFilePath)) {
            return deviceLocalFile;
        } else {
            const metadataLanguageCode = libCom.getStateVariable(context, 'instanceLanguage');
            return prefix + '-' + metadataLanguageCode + '.xml';
        }

    }

    /**
     * Object containing list of smartform template control types that are supported in SAM
     * Used to exclude missing types for value map and visibility rules when parsing template XML
     * @returns 
     */
    static getSupportedSmartformControls() {
        return {
            'numberinput': true,
            'textinput': true,
            'note': true,
            'label': true,
            'boolinput': true,
            'dropdown': true,
            'dateinput': true,
            'attachment': true,
            'signature': true,
            'stateElement': true,
        };
    }
}
