import libCom from '../Common/Library/CommonLibrary';
import libForm from '../Common/Library/FormatLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libThis from './MeasuringPointLibrary';
import Logger from '../Log/Logger';
import ODataDate from '../Common/Date/ODataDate';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libLocal from '../Common/Library/LocalizationLibrary';
import LAMValuesOnLoaded from '../LAM/CreateUpdate/LAMValuesCreateUpdateOnLoaded';
import validateLAM from '../LAM/CreateUpdate/LAMUpdateValidation';
import { SplitReadLink } from '../Common/Library/ReadLinkUtils';

export default class {
    
    /**
     * Runs when a tracked field on the measuring point reading screen is changed
     */
    static measurementDocumentCreateUpdateOnChange(clientAPI) {

        var control = clientAPI.getControl();
        var name = control.definition().getName();

        switch (name) {
            default:
                break;
        }
    }

    /**
     * Runs when the point details screen is loaded
     */
    static pointDetailsOnPageLoad(pageClientAPI) {
        let binding = pageClientAPI.binding;
        pageClientAPI.setCaption(libForm.formatDetailHeaderDisplayValue(pageClientAPI, binding.Point,
            pageClientAPI.localizeText('point')));
    }

    /**
     * Runs when the measuring point reading screen is loaded
     */
    static measurementDocumentCreateUpdateOnPageLoad(pageClientAPI) {

        if (!libCom.getStateVariable(pageClientAPI, 'measurementDocumentCreateUpdateOnPageLoaded')) {
            //prevent OnLoaded code from firing more than once for this page
            libCom.setStateVariable(pageClientAPI, 'measurementDocumentCreateUpdateOnPageLoaded',true);
            libThis.measurementDocumentCreateUpdateSetPageCaption(pageClientAPI);
        }
       libThis.measurementDocumentCreateUpdateFieldVisibility(pageClientAPI);
        return libThis.measurementDocumentCreateUpdateFieldValues(pageClientAPI).then(() => {
            return libThis.loadLocalDefaults(pageClientAPI);
        });
    }

    /**
     * If FDC, default the reading value if there is a local measurement document for this point.  Store these in state variable for later use
     * @param {*} context 
     */
    static loadLocalDefaults(context) {
        let readingType = libCom.getStateVariable(context, 'ReadingType');
        if (readingType === 'MULTIPLE') { //Read local default values for FDC
            let binding = context.binding;
            let readingControl = libCom.getControlProxy(context.getPageProxy(), 'ReadingSim');
            let valControl = libCom.getControlProxy(context.getPageProxy(), 'ValuationCodeLstPkr');
            let noteControl = libCom.getControlProxy(context.getPageProxy(), 'ShortTextNote');
            let point;

            if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
                binding = binding.PRTPoint;
            }
            if (binding.hasOwnProperty('Point')) {
                point = Number(binding.Point);
            } else {
                point = Number(binding.MeasuringPoint.Point);
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', ['ReadingValue', 'ValuationCode', 'ShortText'], "$filter=sap.islocal() eq true and Point eq '" + point + "'&$orderby=ReadingTimestamp desc&$top=1").then(results => {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    let object = {};
                    object.defaultReading = '';
                    object.defaultValCode = '';
                    object.defaultNote =  '';

                    if (row.ReadingValue) {
                        readingControl.setValue(row.ReadingValue);
                        object.defaultReading = row.ReadingValue;
                    }
                    if (row.ValuationCode) {
                        if (binding.CatalogType && binding.CodeGroup) {
                            valControl.setValue('PMCatalogCodes(Code=\'' + row.ValuationCode + '\',CodeGroup=\'' + binding.CodeGroup + '\',Catalog=\'' + binding.CatalogType + '\')');
                        } else {
                            valControl.setValue('');
                        }
                        object.defaultValCode = row.ValuationCode;
                    }
                    if (row.ShortText) {
                        noteControl.setValue(row.ShortText);
                        object.defaultNote = row.ShortText;
                    }
                    let defaults = libCom.getStateVariable(context, 'TempPointDefaults');
                    if (!defaults) {
                        defaults = {};
                    }
                    defaults[point] = object;
                    libCom.setStateVariable(context, 'TempPointDefaults', defaults);
                }
                return Promise.resolve(true);
            });
        }
        return Promise.resolve(true);
    }

    /**
     * Sets the page caption
     */
    static measurementDocumentCreateUpdateSetPageCaption(pageClientAPI) {
        let message;
        
        if (libThis.evalIsUpdateTransaction(pageClientAPI)) {
            message = pageClientAPI.localizeText('edit_point_reading');
        } else {
            if (pageClientAPI._page.id === 'MeasurementDocumentCreateUpdatePage') { // in this case we take reading for a specific point
                message = pageClientAPI.localizeText('take_reading');
            } else {
                let count = pageClientAPI.getControl('FormCellContainer')._control.getTotalItemsCount();
                message = pageClientAPI.localizeText('take_reading_x', [count]);
            }
        }
        pageClientAPI.setCaption(message);
    }

    /**
    * Sets values for create/update service before writing OData record
    */
    static measurementDocumentCreateUpdateSetODataValue(pageClientAPI, key) {
        let binding = pageClientAPI.binding;
        let currentDateTime = libCom.getStateVariable(pageClientAPI, 'CurrentDateTime') || new Date();
        let odataDate = new ODataDate(currentDateTime);
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
            binding = binding.PRTPoint;
        }

        //Only create will be supported for now.  SB and HCP SDK cannot support local updates merging into the create.
        //This means that we cannot allow local updates (edits) on a measurement document
        switch (key) {
            case 'RecordedValue':
                if (String(libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', null, true)) !== '0') {
                    return String(libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', null, true));
                } else { //to prevent sync failing after updating local measuring document(MD without reading)
                    return '';
                }
            case 'ReadingValue': {
                let readingValue = libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', null, true);
                // if readingValue contains "," only then the type would be string, otherwise would be number
                if (typeof(readingValue) === 'string' && libCom.isDefined(readingValue)) {
                    return libLocal.toNumber(pageClientAPI, readingValue);
                } else {
                    if (libCom.isDefined(readingValue)) {
                        return readingValue;
                    } else {
                        return 0;
                    }
                }
            }
            case 'ReadingTime':
                return odataDate.toDBTimeString(pageClientAPI);
            case 'ReadingDate':
                return odataDate.toDBDateString(pageClientAPI);
            case 'MeasurementDocNum':
                return libCom.GenerateOfflineEntityId();
            case 'ValuationCode':
                try {
                    let valuationCodeListPickerValue = libCom.getTargetPathValue(pageClientAPI, '#Control:ValuationCodeLstPkr/#Value');
                    let valuationCodeReadlink = libCom.getListPickerValue(valuationCodeListPickerValue);

                    if (valuationCodeReadlink) {
                        let valuationCodeObject = SplitReadLink(valuationCodeReadlink);
                        return valuationCodeObject.Code;
                    }
                } catch (exception) {
                    return '';
                }
                return '';
            case 'CodeDescription':
                try {
                    let valuationCodeListPickerValue = libCom.getTargetPathValue(pageClientAPI, '#Control:ValuationCodeLstPkr/#Value');
                    let codeDescription = valuationCodeListPickerValue[0].DisplayValue.split('-').toString().split(',')[1].trim();
                    return codeDescription;
                } catch (exception) {
                    return '';
                }
            case 'ReadBy':
                return libCom.getSapUserName(pageClientAPI);
            case 'ShortTextNote':
                return libCom.getFieldValue(pageClientAPI, 'ShortTextNote', '', null, true);
            case 'CodeGroup':
                if (binding.hasOwnProperty('CodeGroup')) {
                    return binding.CodeGroup;
                } else {
                    return binding.MeasuringPoint.CodeGroup;
                }
            case 'HasReadingValue':
                return (libVal.evalIsEmpty(libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', null, true))) ? '' : 'X';
            case 'ReadingTimestamp':
                {
                    return odataDate.toDBDateTimeString(pageClientAPI);
                }
            case 'UOM':
                {
                    if (binding.hasOwnProperty('RangeUOM')) {
                        return binding.RangeUOM;
                    } else if (binding.hasOwnProperty('MeasuringPoint') && binding.MeasuringPoint.hasOwnProperty('RangeUOM')) {
                        return binding.MeasuringPoint.RangeUOM;
                    } else {
                        return '';
                    }
                }
            default:
                return '';
        }
    }

    /**
     * Sets the initial values for fields when the screen is loaded
     */
    static measurementDocumentCreateUpdateFieldValues(pageClientAPI) {

        //Check to see if there is a local record in MeasurementDocument entity set that matches this point.  If so, grab the record
        //and use it to set initial values for these fields.
        //The rest of the fields can use their default binding from MeasuringPoint entity set row:
        let controls = {};
        controls = libCom.getControlDictionaryFromPage(pageClientAPI);
        let binding = pageClientAPI.binding;
        let ReadingSim = Object.keys(controls).find(control => control.includes('ReadingSim'));
        let ValuationCodeLstPkr = Object.keys(controls).find(control => control.includes('ValuationCodeLstPkr'));
        let ShortTextNote = Object.keys(controls).find(control => control.includes('ShortTextNote'));
        let CharacteristicSim = Object.keys(controls).find(control => control.includes('CharacteristicSim'));

        if (libThis.evalIsUpdateTransaction(pageClientAPI)) {
            controls[ReadingSim].setValue(binding.ReadingValue);
            if (binding.ValuationCode.trim()) {
                controls[ValuationCodeLstPkr].setValue([binding.ValuationCode.trim()]);
            }
            controls[ShortTextNote].setValue(binding.ShortText);
        }
        let charName = '';
        if (binding.hasOwnProperty('CharName')) {
            charName = binding.CharName;
        } else {
            charName = binding.MeasuringPoint ? binding.MeasuringPoint.CharName : binding.PRTPoint.CharName;
        }
        let charDescription = '';
        if (binding.hasOwnProperty('CharDescription')) {
            charDescription = binding.CharDescription;
        } else {
            charDescription = binding.MeasuringPoint ? binding.MeasuringPoint.CharDescription : binding.PRTPoint.CharDescription;
        }
        let charDisplay = '';
        if (!libVal.evalIsEmpty(charName)) {
            charDisplay = libForm.getFormattedKeyDescriptionPair(pageClientAPI, charName, charDescription);
        }
        if (CharacteristicSim) {
            controls[CharacteristicSim].setValue(charDisplay);
        }

        if (binding.PointType === 'L') {
            return LAMValuesOnLoaded(pageClientAPI);
        }

        return Promise.resolve();
    }

    /**
     * Sets the visibility state for fields when the screen is loaded
     */
    static measurementDocumentCreateUpdateFieldVisibility(pageClientAPI) {

        let controls = libCom.getControlDictionaryFromPage(pageClientAPI);
        let LRPLstPkr = Object.keys(controls).find(control => control.includes('LRPLstPkr'));
        let StartPoint = Object.keys(controls).find(control => control.includes('StartPoint'));
        let EndPoint = Object.keys(controls).find(control => control.includes('EndPoint'));
        let Length = Object.keys(controls).find(control => control.includes('Length'));
        let UOMLstPkr = Object.keys(controls).find(control => control.includes('UOMLstPkr'));
        let MarkerUOMLstPkr =Object.keys(controls).find(control => control.includes('MarkerUOMLstPkr'));
        let Offset1TypeLstPkr = Object.keys(controls).find(control => control.includes('1TypeLstPkr'));
        let Offset1 = Object.keys(controls).find(control => control.includes('offset1'));
        let Offset1UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset1UOMLstPkr'));
        let Offset2TypeLstPkr = Object.keys(controls).find(control => control.includes('2TypeLstPkr'));
        let Offset2 = Object.keys(controls).find(control => control.includes('offset2'));
        let Offset2UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset2UOMLstPkr'));
        let DistanceFromEnd = Object.keys(controls).find(control => control.includes('DistanceFromEnd'));
        let DistanceFromStart = Object.keys(controls).find(control => control.includes('DistanceFromStart'));
        let StartMarkerLstPkr = Object.keys(controls).find(control => control.includes('StartMarkerLstPkr'));
        let EndMarkerLstPkr =Object.keys(controls).find(control => control.includes('EndMarkerLstPkr'));
        let ValuationCodeLstPkr = Object.keys(controls).find(control => control.includes('ValuationCodeLstPkr'));
        let ValDescriptionSim = Object.keys(controls).find(control => control.includes('ValDescriptionSim')); 
        let ReadingSim = Object.keys(controls).find(control => control.includes('ReadingSim'));
        let CharacteristicSim = Object.keys(controls).find(control => control.includes('CharacteristicSim'));
        let binding = pageClientAPI.binding;
        let codeGroup = '';
        if (binding.hasOwnProperty('CodeGroup')) {
            codeGroup = binding.CodeGroup;
        } else {
            codeGroup = binding.MeasuringPoint ? binding.MeasuringPoint.CodeGroup : binding.PRTPoint.CodeGroup;
        }
        let charName = '';
        if (binding.hasOwnProperty('CharName')) {
            charName = binding.CharName;
        } else {
            charName = binding.MeasuringPoint ? binding.MeasuringPoint.CharName : binding.PRTPoint.CharName;
        }
        let picker = controls[ValuationCodeLstPkr];
        let valDescription = controls[ValDescriptionSim];

        //Hide the reading/characteristic fields if characteristic is blank
        if (libVal.evalIsEmpty(charName)) {
            let control = controls[ReadingSim];
            control.setVisible(false, false);
            if (libCom.getStateVariable(pageClientAPI, 'ReadingType') === 'MULTIPLE') {
                if (valDescription) {
                    valDescription.setVisible(true, false);
                }
            }
            control = controls[CharacteristicSim];
            if (control) {
                control.setVisible(false, false);
            }
        }

        //Hide the valuation code control if code group is empty for the point
        if (libVal.evalIsEmpty(codeGroup) && libCom.isDefined(picker)) {
            picker.setVisible(false, false);
        }

        let requiredFields = this.setRequiredFields(binding);

        pageClientAPI.binding.RequiredFields = requiredFields;

        let readingType = libCom.getStateVariable(pageClientAPI, 'ReadingType');
        if (binding.PointType === 'L' && readingType === 'MULTIPLE') {
            let lamControls = [LRPLstPkr, StartPoint, EndPoint, Length, UOMLstPkr,
                               StartMarkerLstPkr, DistanceFromStart, EndMarkerLstPkr, DistanceFromEnd,
                               MarkerUOMLstPkr, Offset1TypeLstPkr, Offset1, Offset1UOMLstPkr,
                               Offset2TypeLstPkr, Offset2, Offset2UOMLstPkr];
            for (let controlName of lamControls) {
                let control = controls[controlName];
                control.setVisible(true);
            }
        }

        return null;
    }

    /**
     * Sets the Required fields for the Measuring Point to the binding Object
     * This is used for the Filter functionality by the FDC control
     */
    static setRequiredFields(binding) {
        let requiredFields = [];

        if (!libThis.evalCodeGroupIsEmpty(binding)) { //code group is not empty
            
            if (libThis.evalIsCodeOnly(binding)) { //Val Code only
                requiredFields.push({
                    'NumberOfFieldsRequired' : 1,
                    'Fields' : 
                    [
                        'ValuationCodeLstPkr',
                    ],
                });

            } else if (libThis.evalIsCodeSufficient(binding)) { //Both fields exist and one is required
                requiredFields.push({
                    'NumberOfFieldsRequired' : 1,
                    'Fields' :
                    [
                        'ReadingSim', 'ValuationCodeLstPkr',
                    ],
                });
            } else { //Reading only
                requiredFields.push({
                    'NumberOfFieldsRequired' : 1,
                    'Fields' :
                    [
                        'ReadingSim',
                    ],
                });
            }

        } else { //Code group empty means Reading only
            requiredFields.push({
                'NumberOfFieldsRequired' : 1,
                'Fields' :
                [
                    'ReadingSim',
                ],
            });
        }

        return requiredFields;
    }

    /**
    * Runs when the user presses the "Read" button on a measuring point
    * We allow one local reading per point, so decide if this is a create doc or update doc for the current point
    * Save some state variables to be used later
    * Run the nav action to the screen
    */
    static measurementDocumentCreateUpdateNav(pageClientAPI) {
        let point = libCom.getTargetPathValue(pageClientAPI, '#Property:Point');
        //Read from measurment documents looking for a modified row matching this point
        return pageClientAPI.read(
            '/SAPAssetManager/Services/AssetManager.service',
            'MeasurementDocuments',
            [],
            "$filter=Point eq '" + point + "'&$orderby=ReadingTimestamp desc&$top=1").then(result => {
                if (result && result.length > 0) {
                    //Grab the first row (should only ever be one row)
                    let row = result.getItem(0);
                    if (libCom.isCurrentReadLinkLocal(row['@odata.readLink'])) {
                        libCom.setStateVariable(pageClientAPI, 'TransactionType', 'UPDATE');
                        libCom.setStateVariable(pageClientAPI, 'MeasurementRow', row);
                        return pageClientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
                    }
                }
                libCom.setStateVariable(pageClientAPI, 'TransactionType', 'CREATE');
                return pageClientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
            });
    }
    //*************************************************************
    //Validation Rules
    //*************************************************************

    /**
     * handle error and warning processing for measurement document create/update
     */
    static measurementDocumentCreateUpdateValidation(pageClientAPI) {
        let binding = pageClientAPI.binding;
        var dict = {};

        //Grab all variables used in all rules, storing in a dictionary
        libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'ShortTextNote', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'ValuationCodeLstPkr', '', dict, true);
        let valuationCodeLstPkrLink = libCom.getListPickerValue(dict.ValuationCodeLstPkr);
        if (valuationCodeLstPkrLink) {
            let valuationCodeLstPkrLinkObject = SplitReadLink(valuationCodeLstPkrLink);
            dict.ValuationCodeLstPkr = valuationCodeLstPkrLinkObject.Code;
        } else {
            dict.ValuationCodeLstPkr = '';
        }
        
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
            binding = binding.PRTPoint;
        }
        if (binding.hasOwnProperty('CounterOverflow')) {
            dict.CounterOverflow = libLocal.toNumber(pageClientAPI, binding.CounterOverflow);
        } else {
            dict.CounterOverflow = libLocal.toNumber(pageClientAPI, binding.MeasuringPoint.CounterOverflow);
        }

        if (binding.previousReadingObj) {
            dict.PrevReadingValue = libLocal.toNumber(pageClientAPI, binding.previousReadingObj.ReadingValue);
        } else if (binding.hasOwnProperty('PrevReadingValue')) {
            dict.PrevReadingValue = libCom.convertSapStringToNumber(binding.PrevReadingValue);
        }

        if (binding.hasOwnProperty('IsCounter')) {
            dict.IsCounter = binding.IsCounter;
        } else {
            dict.IsCounter = binding.MeasuringPoint.IsCounter;
        }
        if (binding.hasOwnProperty('IsCounterOverflow')) {
            dict.IsCounterOverflow = binding.IsCounterOverflow;
        } else {
            dict.IsCounterOverflow = binding.MeasuringPoint.IsCounterOverflow;
        }
        if (binding.hasOwnProperty('IsReverse')) {
            dict.IsReverse = binding.IsReverse;
        } else {
            dict.IsReverse = binding.MeasuringPoint.IsReverse;
        }
        if (binding.hasOwnProperty('IsLowerRange')) {
            dict.IsLowerRange = binding.IsLowerRange;
        } else {
            dict.IsLowerRange = binding.MeasuringPoint.IsLowerRange;
        }
        if (binding.hasOwnProperty('IsUpperRange')) {
            dict.IsUpperRange = binding.IsUpperRange;
        } else {
            dict.IsUpperRange = binding.MeasuringPoint.IsUpperRange;
        }
        if (binding.hasOwnProperty('IsCodeSufficient')) {
            dict.IsCodeSufficient = binding.IsCodeSufficient;
        } else {
            dict.IsCodeSufficient = binding.MeasuringPoint.IsCodeSufficient;
        }
        if (binding.hasOwnProperty('LowerRange')) {
            dict.LowerRange = libCom.convertSapStringToNumber(binding.LowerRange);
        } else {
            dict.LowerRange = libCom.convertSapStringToNumber(binding.MeasuringPoint.LowerRange);
        }
        if (binding.hasOwnProperty('UpperRange')) {
            dict.UpperRange = libCom.convertSapStringToNumber(binding.UpperRange);
        } else {
            dict.UpperRange = libCom.convertSapStringToNumber(binding.MeasuringPoint.UpperRange);
        }
        if (binding.hasOwnProperty('CodeGroup')) {
            dict.CodeGroup = binding.CodeGroup;
        } else {
            dict.CodeGroup = binding.MeasuringPoint.CodeGroup;
        }
        if (binding.hasOwnProperty('Decimal')) {
            dict.Decimal = Number(binding.Decimal);
        } else {
            dict.Decimal = Number(binding.MeasuringPoint.Decimal);
        }
        if (binding.hasOwnProperty('CharName')) {
            dict.CharName = binding.CharName;
        } else {
            dict.CharName = binding.MeasuringPoint.CharName;
        }
        if (binding.hasOwnProperty('Point')) {
            dict.Point = Number(binding.Point);
        } else {
            dict.Point = Number(binding.MeasuringPoint.Point);
        }

        //If this is a counter and a local reading exists, use it for validation
        if (dict.IsCounter === 'X' && libCom.IsOnCreate(pageClientAPI) && libThis.evalReadingIsNumeric(pageClientAPI, dict)) {
            return libThis.getPreviousCounterReading(pageClientAPI, binding).then((previousReading) => {
                if (previousReading) {
                    dict.PrevReadingValue = previousReading;
                }
                return libThis.processMeasurementDocumentCreateUpdateValidation(pageClientAPI, dict);
            });
        } else {
            return libThis.processMeasurementDocumentCreateUpdateValidation(pageClientAPI, dict);
        }
        
    }

    static processMeasurementDocumentCreateUpdateValidation(pageClientAPI, dict) {
        //Process all warnings and errors for this screen
        //Use .then chaining to sequentially process the async events
                
        this.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'ReadingSim'), false);
        this.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'ShortTextNote'), false);
        this.setInlineControlErrorVisibility(libCom.getControlProxy(pageClientAPI, 'ValuationCodeLstPkr'), false);
        //Clear validation will refresh all fields on screen
        libCom.getControlProxy(pageClientAPI, 'ValuationCodeLstPkr').clearValidation();

        //Start with inline errors
        return libThis.validateReadingIsNumeric(pageClientAPI, dict)
        .then(libThis.validateReadingExceedsLength.bind(null, pageClientAPI, dict), libThis.validateReadingExceedsLength.bind(null, pageClientAPI, dict))
        .then(libThis.validateShortTextExceedsLength.bind(null, pageClientAPI, dict), libThis.validateShortTextExceedsLength.bind(null, pageClientAPI, dict))
        .then(libThis.validateValuationCodeEntered.bind(null, pageClientAPI, dict), libThis.validateValuationCodeEntered.bind(null, pageClientAPI, dict))
        .then(libThis.validatePrecisionWithinLimit.bind(null, pageClientAPI, dict), libThis.validatePrecisionWithinLimit.bind(null, pageClientAPI, dict))
        .then(libThis.validateReadingLessThanCounterOverflow.bind(null, pageClientAPI, dict), libThis.validateReadingLessThanCounterOverflow.bind(null, pageClientAPI, dict))
        .then(libThis.validateContinuousReverseCounter.bind(null, pageClientAPI, dict), libThis.validateContinuousReverseCounter.bind(null, pageClientAPI, dict))
        .then(libThis.validateContinuousReverseCounterPositiveReading.bind(null, pageClientAPI, dict), libThis.validateContinuousReverseCounterPositiveReading.bind(null, pageClientAPI, dict))
        .then(libThis.validateContinuousCounter.bind(null, pageClientAPI, dict), libThis.validateContinuousCounter.bind(null, pageClientAPI, dict))
        .then(libThis.validateOverflowCounterIsNotNegative.bind(null, pageClientAPI, dict), libThis.validateOverflowCounterIsNotNegative.bind(null, pageClientAPI, dict))
        .then(libThis.validateReverseCounterWithoutOverflowIsNotPositive.bind(null, pageClientAPI, dict), libThis.validateReverseCounterWithoutOverflowIsNotPositive.bind(null, pageClientAPI, dict))
        .then(libThis.processInlineErrors.bind(null, dict), libThis.processInlineErrors.bind(null, dict))
        //Dialog based warnings
        .then(libThis.validateZeroReading.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateReadingGreaterThanOrEqualLowerRange.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateReadingLessThanOrEqualUpperRange.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateReverseCounterRollover.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateCounterReadingEqualToPreviousReading.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateCounterRolloverWithOverflow.bind(null, pageClientAPI, dict), null)
        .then(libThis.validateLAM.bind(null, pageClientAPI), null)
        .then(function() {
            return true;
        }, function() {
            return false;
        }); //Pass back true or false to calling action

    }

    static getPreviousCounterReading(pageClientAPI, binding) {

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/MeasurementDocs`,[], "$filter=PointObjectKey eq ''&$orderby=ReadingTimestamp desc&$top=1").then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                return row.RecordedValue;
            }

            return Promise.resolve();
        });
    }

    static setInlineControlErrorVisibility(control, controlVisibility) {
        libCom.setInlineControlErrorVisibility(control, controlVisibility);
    }

    static getLatestNonLocalReading(context, measuringPoint, queryOptions) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${measuringPoint['@odata.readLink']}/MeasurementDocs`, [], queryOptions).then(previousReading => {
            return previousReading;
        });

    }
    /**
     * Checks if Point is  a counter
     */

    static validateIsCounter(binding) {
        if (binding.hasOwnProperty('IsCounter')) {
            return binding.IsCounter === 'X';
        } else {
            return binding.MeasuringPoint.IsCounter === 'X';
        }
    }

    /**
     * As part of MeasurintPoint Validation, check if we have LAM data that needs
     * validation
     * @param {*} context 
     */
    
    static validateLAM(context) {
        // Check if we have a LAM point AND we are on the FDC control
        if (context.binding.PointType === 'L' && (libCom.getStateVariable(context, 'ReadingType') === 'MULTIPLE')) { 
            // validate LAM for real - Call LAM library validation
            return validateLAM(context).then(resolved => {
                if (resolved) {
                    return Promise.resolve(true);
                } else {
                    return Promise.reject();
                }
            });
        } else {
            // no LAM, so just resolve 
            return Promise.resolve(true);
        }
    }

    /**
     * Called after all inline validation has taken place in the main promise chain.
     * If an inline enabled validation rule has failed, then return a promise failure, else return a promise success
     * Chain will move on to dialog enabled validation if no inline were triggered
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
     * New reading must be numeric
     */
    static validateReadingIsNumeric(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }
        //New reading must be a number
        if (libLocal.isNumber(pageClientAPI, dict.ReadingSim)) { 
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('validation_reading_is_numeric');
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * New reading decimal precision must be within limits
     */
    static validatePrecisionWithinLimit(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let error = false;
        let message = '';

        //New reading must be a number
        if (libThis.evalReadingIsNumeric(pageClientAPI, dict)) {
            //Did user provide decimal when integer is required for point?
            if (libThis.evalBadInteger(pageClientAPI, dict)) {
                message = pageClientAPI.localizeText('validation_reading_must_be_an_integer_without_decimal_precision');
                error = true;
            } else {
                //Did user provide allowed decimal precision for point?
                if (libThis.evalBadDecimal(pageClientAPI, dict)) {
                    let dynamicParams = [dict.Decimal];
                    message = pageClientAPI.localizeText('validation_reading_within_decimal_precision_of',dynamicParams);
                    error = true;
                }
            }
        }
        if (error) {
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * Valuation code must be selected if code group is not blank and either
     * (characteristic is blank) or (characteristic is not blank and code sufficient is set and reading is blank)
     */
    static validateValuationCodeEntered(pageClientAPI, dict) {
        let error = false;
        let message = '';
        //Code group is not empty
        if (!libThis.evalCodeGroupIsEmpty(dict)) {
            //Characteristic is blank
            if (libThis.evalIsCodeOnly(dict)) {
                error = (libThis.evalValuationCodeIsEmpty(dict));
                if (error) {
                    message = pageClientAPI.localizeText('field_is_required');
                    libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ValuationCodeLstPkr'), message);
                }
            } else {
                //Code sufficient is set and reading is empty
                if (libThis.evalIsCodeSufficient(dict) && libThis.evalIsReadingEmpty(dict)) {
                    error = (libThis.evalValuationCodeIsEmpty(dict));
                    if (error) {
                        message = pageClientAPI.localizeText('validation_valuation_code_or_reading_must_be_selected');
                        libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
                        libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ValuationCodeLstPkr'), message);
                    }
                }
            }
        }
        if (error) {
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * New reading must be <= length limit defined in global
     */
    static validateReadingExceedsLength(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //New reading length must be <= global maximum
        let max = libCom.getAppParam(pageClientAPI, 'MEASURINGPOINT', 'ReadingLength');

        if (libThis.evalReadingLengthWithinLimit(dict, max)) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = [max];
            let message = pageClientAPI.localizeText('validation_maximum_field_length', dynamicParams);
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * New short text must be <= length limit defined in global
     */
    static validateShortTextExceedsLength(pageClientAPI, dict) {

        //New short text length must be <= global maximum
        let max = libCom.getAppParam(pageClientAPI, 'MEASURINGPOINT', 'ShortTextLength');

        if (libThis.evalShortTextLengthWithinLimit(dict, max)) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = [max];
            let message = pageClientAPI.localizeText('validation_maximum_field_length', dynamicParams);
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ShortTextNote'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * If this is a counter overflow point, the current reading must be less than the overflow value
     */
    static validateReadingLessThanCounterOverflow(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let error = false;
        //Is a counter and has overflow value
        if (libThis.evalIsCounter(dict) && libThis.evalIsCounterOverflow(dict)) {
            //previous = new reading or overflow > new reading
            error = (libThis.evalIsPreviousReadingNotEmptyAndReadingEqualsPrevious(pageClientAPI, dict) || libThis.evalIsOverflowNotEmptyAndOverflowGreaterThanReading(pageClientAPI, dict)) ? false : true;
        }
        if (error) {
            let dynamicParams = [dict.CounterOverflow];
            let message = pageClientAPI.localizeText('validation_reading_less_than_counter_overflow',dynamicParams);
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a counter point, the new reading should not equal the previous
     */
    static validateCounterReadingEqualToPreviousReading(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let warning = false;
        //Previous reading not empty
        if (!libThis.evalIsPreviousReadingEmpty(dict)) {
            //previous = new reading
            if (libThis.evalIsCounter(dict)) {
                warning = (libThis.evalPreviousReadingEqualsReading(pageClientAPI, dict));
            }
        }
        if (warning) {
            let messageText = pageClientAPI.localizeText('validation_counter_reading_is_the_same_as_the_previous_counter_reading');
            let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
            let okButtonText = pageClientAPI.localizeText('continue_text');
            let cancelButtonText = pageClientAPI.localizeText('cancel');

            return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a reverse counter point, the previous reading must be >= current reading
     */
    static validateContinuousReverseCounter(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let error = false;
        //Reverse counter with no overflow value
        if (libThis.evalIsCounter(dict) && libThis.evalIsReverse(dict) && !libThis.evalIsCounterOverflow(dict)) {
            //Previous reading is not empty
            if (!libThis.evalIsPreviousReadingEmpty(dict)) {
                //Previous reading >= new reading
                error = (!libThis.evalPreviousReadingGreaterThanOrEqualReading(pageClientAPI, dict));
            }
        }
        if (error) {
            let dynamicParams = [dict.PrevReadingValue];
            let message = pageClientAPI.localizeText('validation_reading_must_be_less_than_or_equal_to_previous_reverse_counter_reading_of', dynamicParams);
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a reverse counter point and no previous reading exists, the new reading must be <= 0
     */
    static validateContinuousReverseCounterPositiveReading(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let error = false;
        //Is reverse counter and does not have overflow value
        if (libThis.evalIsCounter(dict) && libThis.evalIsReverse(dict) && !libThis.evalIsCounterOverflow(dict)) {
            //Previous reading is empty
            if (libThis.evalIsPreviousReadingEmpty(dict)) {
                //New reading <= 0
                error = (!libThis.evalReadingLessThanEqualToZero(pageClientAPI, dict));
            }
        }
        if (error) {
            let message = pageClientAPI.localizeText('validation_reverse_counter_reading_must_be_less_than_or_equal_toZero');
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a non-reverse, non-overflow continuous counter point, the new reading must be >= previous reading, or >= 0 if no previous reading
     */
    static validateContinuousCounter(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let error = false;
        let message = '';
        //Non-reverse counter with no overflow value
        if (libThis.evalIsCounter(dict) && !libThis.evalIsReverse(dict) && !libThis.evalIsCounterOverflow(dict)) {
            //Previous reading is not empty
            if (!libThis.evalIsPreviousReadingEmpty(dict)) {
                //New reading < previous reading
                if (!libThis.evalReadingGreaterThanOrEqualPreviousReading(pageClientAPI, dict)) {
                    error = true;
                    let dynamicParams = [dict.PrevReadingValue];
                    message = pageClientAPI.localizeText('validation_reading_greater_than_or_equal_to_previous_counter_reading',dynamicParams);
                }
                //Previous reading empty
            } else {
                //Reading < 0
                if (!libThis.evalReadingGreaterThanOrEqualToZero(pageClientAPI, dict)) {
                    error = true;
                    message = pageClientAPI.localizeText('validation_reading_greater_than_or_equal_toZero');
                }
            }
        }
        if (error) {
            libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);

        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a reverse counter point with overflow, the new reading must be >= 0 if no previous reading, or <= previous reading if one exists
     */
    static validateReverseCounterRollover(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let warning = false;
        //Reverse counter with overflow value
        if (libThis.evalIsCounter(dict) && libThis.evalIsReverse(dict) && libThis.evalIsCounterOverflow(dict)) {
            //Previous reading is empty
            if (libThis.evalIsPreviousReadingEmpty(dict)) {
                //New reading >= previous blank reading (zero)
                warning = (!libThis.evalReadingGreaterThanOrEqualPreviousReading(pageClientAPI, dict));
                //Previous reading exists
            } else {
                //Previous reading >= new reading
                warning = (!libThis.evalPreviousReadingGreaterThanOrEqualReading(pageClientAPI, dict));
            }
        }
        if (warning) {
            let messageText = pageClientAPI.localizeText('validation_reverse_counter_reading_overflow');
            let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
            let okButtonText = pageClientAPI.localizeText('continue_text');
            let cancelButtonText = pageClientAPI.localizeText('cancel');

            return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is a non-reverse counter point with overflow, the new reading must be >= previous reading
     */
    static validateCounterRolloverWithOverflow(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        let warning = false;
        //Non-reverse counter with overflow value
        if (libThis.evalIsCounter(dict) && !libThis.evalIsReverse(dict) && libThis.evalIsCounterOverflow(dict)) {
            //Previous reading is not empty
            if (!libThis.evalIsPreviousReadingEmpty(dict)) {
                //New reading >= previous blank reading (zero)
                warning = (!libThis.evalReadingGreaterThanOrEqualPreviousReading(pageClientAPI, dict));
            }
        }
        if (warning) {
            let messageText = pageClientAPI.localizeText('validation_entered_counter_reading_would_cause_a_counter_overflow');
            let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
            let okButtonText = pageClientAPI.localizeText('continue_text');
            let cancelButtonText = pageClientAPI.localizeText('cancel');

            return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * If this is an overflow counter point, the new reading must be >= 0
     */
    static validateOverflowCounterIsNotNegative(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //Overflow counter
        if (libThis.evalIsCounter(dict) && libThis.evalIsCounterOverflow(dict)) {
            //New reading >= 0
            if (libThis.evalReadingGreaterThanOrEqualToZero(pageClientAPI, dict)) {
                return Promise.resolve(true);
            } else {
                let message = pageClientAPI.localizeText('validation_overflow_counter_reading_must_be_greater_than_or_equal_toZero');
                libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
                dict.InlineErrorsExist = true;
                return Promise.reject(false);
            }
        }
        return Promise.resolve(false);
    }

    /**
     * If this is a reverse non-overflow counter point, the new reading must be <= 0
     */
    static validateReverseCounterWithoutOverflowIsNotPositive(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //Reverse counter with no overflow value
        if (libThis.evalIsCounter(dict) && libThis.evalIsReverse(dict) && !libThis.evalIsCounterOverflow(dict)) {
            //New reading <= 0
            if (libThis.evalReadingLessThanEqualToZero(pageClientAPI, dict)) {
                return Promise.resolve(true);
            } else {
                let message = pageClientAPI.localizeText('validation_reverse_counter_reading_must_be_less_than_or_equal_toZero');
                libCom.executeInlineControlError(pageClientAPI, libCom.getControlProxy(pageClientAPI, 'ReadingSim'), message);
                dict.InlineErrorsExist = true;
                return Promise.reject(false);
            }
        }
        return Promise.resolve(false);
    }

    /**
     * Confirm zero reading from user
     */
    static validateZeroReading(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //New reading = 0
        if (libThis.evalReadingIsZero(pageClientAPI, dict)) {
            let messageText = pageClientAPI.localizeText('validation_zero_reading_entered');
            let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
            let okButtonText = pageClientAPI.localizeText('continue_text');
            let cancelButtonText = pageClientAPI.localizeText('cancel');

            return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
    * If lower range exists, new reading must be >= lower range
    */
    static validateReadingGreaterThanOrEqualLowerRange(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //Lower range value exists
        if (libThis.evalIsLowerRange(dict) && !libThis.evalLowerRangeIsEmpty(dict)) {
            //New reading >= lower range
            if (libThis.evalReadingGreaterThanEqualToLowerRange(pageClientAPI, dict)) {
                return Promise.resolve(true);
            } else {
                let dynamicParams = [dict.LowerRange];
                let messageText = pageClientAPI.localizeText('validation_reading_below_lower_range_of',dynamicParams);
                let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
                let okButtonText = pageClientAPI.localizeText('continue_text');
                let cancelButtonText = pageClientAPI.localizeText('cancel');

                return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);
            }
        }
        return Promise.resolve(false);
    }

    /**
     * If lower range exists, new reading must be >= lower range
     */
    static validateReadingLessThanOrEqualUpperRange(pageClientAPI, dict) {

        //Reading is not allowed, or reading is optional and empty
        if (libThis.evalIgnoreReading(dict)) {
            return Promise.resolve(true);
        }

        //Lower range value exists
        if (libThis.evalIsUpperRange(dict) && !libThis.evalUpperRangeIsEmpty(dict)) {
            //New reading <= upper range
            if (libThis.evalReadingLessThanEqualToUpperRange(pageClientAPI, dict)) {
                return Promise.resolve(true);
            } else {
                let dynamicParams = [dict.UpperRange];
                let messageText = pageClientAPI.localizeText('validation_reading_exceeds_upper_range_of',dynamicParams);
                let captionText = pageClientAPI.localizeText('validation_warning_x', [dict.Point]);
                let okButtonText = pageClientAPI.localizeText('continue_text');
                let cancelButtonText = pageClientAPI.localizeText('cancel');

                return libCom.showWarningDialog(pageClientAPI, messageText, captionText, okButtonText, cancelButtonText);

            }
        }

        return Promise.resolve(false);
    }

    /**
     * Evaluates whether this point is a counter
     */
    static evalIsCounter(dict) {
        return dict.IsCounter === 'X';
    }

    /**
     * Evaluates whether this point is a lower range
     */
    static evalIsLowerRange(dict) {
        return dict.IsLowerRange === 'X';
    }

    /**
     * Evaluates whether this point is a upper range
     */
    static evalIsUpperRange(dict) {
        return dict.IsUpperRange === 'X';
    }

    /**
     * Evaluates whether this point is a reverse
     */
    static evalIsReverse(dict) {
        return dict.IsReverse === 'X';
    }

    /**
    * Evaluates whether this point is a counter overflow candidate
    */
    static evalIsCounterOverflow(dict) {
        return dict.IsCounterOverflow === 'X';
    }

    /**
     * Evaluates whether the previous reading is blank
     */
    static evalIsPreviousReadingEmpty(dict) {
        return libVal.evalIsEmpty(dict.PrevReadingValue);
    }

    /**
     * Evaluates whether the reading is blank
     */
    static evalIsReadingEmpty(dict) {
        return libVal.evalIsEmpty(dict.ReadingSim);
    }

    /**
     * Evaluates whether the lower range is empty
     */
    static evalLowerRangeIsEmpty(dict) {
        return libVal.evalIsEmpty(dict.LowerRange);
    }

    /**
     * Evaluates whether the upper range is empty
     */
    static evalUpperRangeIsEmpty(dict) {
        return libVal.evalIsEmpty(dict.UpperRange);
    }

    /**
     * Evaluates whether the counter overflow reading is blank
     */
    static evalIsCounterOverflowEmpty(dict) {
        return libVal.evalIsEmpty(dict.CounterOverflow);
    }

    /**
      * Evaluates whether the code group property is blank
      */
    static evalCodeGroupIsEmpty(dict) {
        return libVal.evalIsEmpty(dict.CodeGroup);
    }

    /**
     * Evaluates whether the valuation code is blank
     */
    static evalValuationCodeIsEmpty(dict) {
        return libVal.evalIsEmpty(dict.ValuationCodeLstPkr);
    }

    /**
     * Evaluates whether the previous reading is not blank and current reading = previous reading
     */
    static evalIsPreviousReadingNotEmptyAndReadingEqualsPrevious(context, dict) {
        if (!libThis.evalIsPreviousReadingEmpty(dict)) {
            return libThis.evalPreviousReadingEqualsReading(context, dict);
        } else {
            return false;
        }
    }

    /**
     * Evaluates whether the previous reading = new reading
     */
    static evalPreviousReadingEqualsReading(context, dict) {
        return (libLocal.toNumber(context, dict.PrevReadingValue) === libLocal.toNumber(context, dict.ReadingSim));
    }

    /**
    * Evaluates whether the counter overflow is not blank and overflow > reading
    */
    static evalIsOverflowNotEmptyAndOverflowGreaterThanReading(context, dict) {
        if (!libThis.evalIsCounterOverflowEmpty(dict)) {
            return (libLocal.toNumber(context, dict.CounterOverflow) > libLocal.toNumber(context, dict.ReadingSim));
        } else {
            return false;
        }
    }

    /**
    * Evaluates whether the previous reading > current reading
    */
    static evalPreviousReadingGreaterThanOrEqualReading(context, dict) {
        return (libLocal.toNumber(context, dict.PrevReadingValue) >= libLocal.toNumber(context, dict.ReadingSim));
    }

    /**
    * Evaluates whether the new reading >= previous reading
    */
    static evalReadingGreaterThanOrEqualPreviousReading(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) >= libLocal.toNumber(context, dict.PrevReadingValue));
    }

    /**
    * Evaluates whether the current reading <= 0
    */
    static evalReadingLessThanEqualToZero(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) <= 0);
    }

    /**
    * Evaluates whether the current reading = 0
    */
    static evalReadingIsZero(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) === 0);
    }

    /**
    * Evaluates whether the current reading >= 0
    */
    static evalReadingGreaterThanOrEqualToZero(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) >= 0);
    }

    /**
     * Evaluates whether the current reading >= lower range
     */
    static evalReadingGreaterThanEqualToLowerRange(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) >= libLocal.toNumber(context, dict.LowerRange));
    }

    /**
    * Evaluates whether the current reading <= upper range
    */
    static evalReadingLessThanEqualToUpperRange(context, dict) {
        return (libLocal.toNumber(context, dict.ReadingSim) <= libLocal.toNumber(context, dict.UpperRange));
    }

    /**
    * Evaluates whether the current reading is a number
    */
    static evalReadingIsNumeric(context, dict) {
        return (libLocal.isNumber(context, dict.ReadingSim)) && dict.ReadingSim !== '';
    }

    /**
    * Evaluates whether the current reading length is within length limit
    */
    static evalReadingLengthWithinLimit(dict, limit) {
        return (dict.ReadingSim.toString().length <= Number(limit));
    }

    /**
    * Evaluates whether the current short text length is within length limit
    */
    static evalShortTextLengthWithinLimit(dict, limit) {
        return (dict.ShortTextNote.length <= Number(limit));
    }

    /**
    * Evaluates whether there is no characteristic, meaning a valuation code must be used
    */
    static evalIsCodeOnly(dict) {
        return (libVal.evalIsEmpty(dict.CharName));
    }

    /**
    * Evaluates whether code sufficient is set
    */
    static evalIsCodeSufficient(dict) {
        return (dict.IsCodeSufficient === 'X');
    }

    /**
     * Returns the decimal precision of the passed in number
     */
    static evalPrecision(value) {
        try {
            value = Number(value);
            if (!isFinite(value)) return 0;
            var e = 1, p = 0;
            while (Math.round(value * e) / e !== value) {
                e *= 10; p++;
            }
            return p;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log('evalPrecision: ' + err.message);
            return 0;
        }
    }

    /**
     * Evaluates whether point requires an integer but user provided decimal
     */
    static evalBadInteger(context, dict) {
        let temp = false;
        if (!libVal.evalIsEmpty(dict.Decimal)) {
            if (libLocal.toNumber(context, dict.Decimal) === 0) {
                temp = (libThis.evalPrecision(dict.ReadingSim) > 0);
            }
        }
        return temp;
    }

    /**
     * Evaluates whether point's decimal precision was exceeded by user reading
     */
    static evalBadDecimal(context, dict) {
        let temp = false;
        let num = libLocal.toNumber(context, dict.ReadingSim);
        if (!libVal.evalIsEmpty(dict.Decimal)) {
            let target = Number(dict.Decimal);
            if (target > 0) {
                temp = (Number(libThis.evalPrecision(num) > target));
            }
        }
        return temp;
    }

    /**
     * Evaluates whether an reading needs to be validated or not
     */
    static evalIgnoreReading(dict) {
        //Reading is not allowed, or reading is optional and empty
        return (libThis.evalIsCodeOnly(dict) || (libThis.evalIsCodeSufficient(dict) && libThis.evalIsReadingEmpty(dict)));
    }


    /**
     * Evaluates whether we are currently in an update transaction
     */
    static evalIsUpdateTransaction(pageClientAPI) {
        return (libCom.getStateVariable(pageClientAPI, 'TransactionType') === 'UPDATE');
    }

    /**
     * Formats the measurement documents list
     */
    static measurementDocumentFieldFormat(sectionProxy) {
        var section = sectionProxy.getName();
        var property = sectionProxy.getProperty();
        var binding = sectionProxy.binding;
        let format = '';
        switch (section) {
            case 'MeasurementDocumentsList': {

                switch (property) {
                    case 'Footnote': {
                        let offset = -1 * libCom.getBackendOffsetFromSystemProperty(sectionProxy);
                        let odataDate = new ODataDate(binding.ReadingDate, binding.ReadingTime, offset);
                        format = sectionProxy.formatDatetime(odataDate.date());
                        break;
                    }
                    case 'Subhead': {
                        format = binding.ReadBy;
                        break;
                    }
                    case 'Description': {
                        let value = '';
                        if (!libVal.evalIsEmpty(binding.ValuationCode)) {
                            if (!libVal.evalIsEmpty(value)) {
                                value = value + ': ';
                            }
                            value = value + libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.ValuationCode, binding.CodeShortText);
                        }
                        format = value;
                        break;
                    }
                    case 'Title': {
                        let value = '';
                        if (binding.HasReadingValue === 'X') {
                            value = binding.ReadingValue + value + ' ' + binding.UOM;
                        } else {
                            value = binding.ReadingValue + ' ' + binding.MeasuringPoint.UoM;
                        }
                        if (!libVal.evalIsEmpty(binding.ValuationCode)) {
                            if (!libVal.evalIsEmpty(value)) {
                                value = value + ': ';
                            }
                            value = value + libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.ValuationCode, binding.CodeShortText);
                        }
                        format = value;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
        return format;
    }

    /**
     * Formats the measuring points detail fields
     */
    static measuringPointDetailsFieldFormat(sectionProxy, key) {

        var binding = sectionProxy.binding;
        
        let value = '';
        let decimal = Number(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());

        let date, time;

        switch (key) {
            case 'Reading':
                if (binding.ReadingValue || (binding.HasReadingValue === 'X' && binding.ReadingValue === 0)) {  //read from MeasurementDocument first

                    value = sectionProxy.formatNumber(binding.ReadingValue, '', {maximumFractionDigits: decimal});
                    if (value && binding.MeasuringPoint.UoM) {
                        value = `${value} ${binding.MeasuringPoint.UoM}`;
                    }
                } else if (binding.IsPrevReading === 'X') { //read from MeasuringPoint as a fallback
                    value = sectionProxy.formatNumber(binding.PrevReadingValue, '', {maximumFractionDigits: decimal});
                    if (value && binding.UoM) {
                        value = `${value} ${binding.UoM}`;
                    }
                }

                return value;
            case 'CurrentValuation':
                if (binding.ValuationCode) {
                    value = libThis.getValuationAndCodeDescription(sectionProxy, binding.ValuationCode, sectionProxy.getPageProxy().binding.CodeGroup, sectionProxy.getPageProxy().binding.CatalogType);
                }
                return value;    
            case 'Valuation':
                if (binding.ValuationCode || !(binding.IsPrevReading === 'X' && !libVal.evalIsEmpty(binding.PrevValuationCode))) {
                    value = libThis.getValuationAndCodeDescription(sectionProxy, binding.ValuationCode, sectionProxy.getPageProxy().binding.CodeGroup, sectionProxy.getPageProxy().binding.CatalogType);
                } else {
                    value = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.PrevValuationCode, binding.PrevCodeDescription);
                }
                return value;
            case 'ReadingDate':

                if (binding.ReadingDate) {
                    date = new OffsetODataDate(sectionProxy,binding.ReadingDate, binding.ReadingTime);
                    value = sectionProxy.formatDate(date.date());
                } else if (binding.IsPrevReading === 'X') {
                    date = new OffsetODataDate(sectionProxy,binding.PrevReadingDate, binding.PrevReadingTime);
                    value = sectionProxy.formatDate(date.date());
                }
                return value;
            case 'ReadingTime':

                if (binding.ReadingTime) {
                    time = new OffsetODataDate(sectionProxy,binding.ReadingDate, binding.ReadingTime);
                    value = sectionProxy.formatTime(time.date());
                } else if (binding.IsPrevReading === 'X') {
                    time = new OffsetODataDate(sectionProxy,binding.PrevReadingDate, binding.PrevReadingTime);
                    value = sectionProxy.formatTime(time.date());
                }
                return value;
            case 'ReadBy':
                if (binding.ReadBy) {
                    value = binding.ReadBy;
                } else if (binding.IsPrevReading === 'X') {
                    value = binding.PrevReadBy;
                }
                return value;
            case 'LowerRange':
                if (binding.IsLowerRange === 'X') {
                    value = sectionProxy.formatNumber(binding.LowerRange, '', {maximumFractionDigits: decimal});
                }
                return value;
            case 'UpperRange':
                if (binding.IsUpperRange === 'X') {
                    value = sectionProxy.formatNumber(binding.UpperRange, '', {maximumFractionDigits: decimal});
                }
                return value;
            case 'Characteristic':
                if (!libVal.evalIsEmpty(binding.CharName)) {
                    value = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.CharName, binding.CharDescription);
                }
                return value;
            case 'Difference':
                if (binding.IsCounterReading === 'X') {
                    value = sectionProxy.formatNumber(binding.CounterReadingDifference, '', {maximumFractionDigits: decimal});
                } else if (binding.IsPrevReading === 'X' && binding.IsCounter === 'X') {
                    value = sectionProxy.formatNumber(binding.PrevCounterReadingDiff, '', {maximumFractionDigits: decimal});
                }
                return value;
            case 'CurrentReading':
                var recordedValue = binding.RecordedValue;
                if (!libVal.evalIsEmpty(recordedValue)) {
                    value = sectionProxy.formatNumber(recordedValue, '', {maximumFractionDigits: decimal}) + ' ' + binding.UOM;
                }
                return value;
            case 'CurrentShortText':
                return libVal.evalIsEmpty(binding.ShortText) ? '' : binding.ShortText;
            default:
                return '';
        }
    }

    static getValuationAndCodeDescription(context, valuationCode, codeGroup, catalogType) {
        if (!libVal.evalIsEmpty(valuationCode)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], "$select=CodeDescription&$filter=Code eq '" + valuationCode + "' and CodeGroup eq '" + codeGroup + "' and Catalog eq '" + catalogType + "'").then( (result) => {
                if (result.length > 0) {
                    //Grab the first row (should only ever be one row)
                    var row = result.getItem(0);
                    var codeDescription = row.CodeDescription;
                    return libForm.getFormattedKeyDescriptionPair(context, valuationCode, codeDescription);
                }
                return '';
            });
        }
        return '';
    }

    static measuringPointFieldFormat(sectionProxy) {
        let property = sectionProxy.getProperty();
        let binding = sectionProxy.binding;
        var propertyValue = '-';

        switch (property) {
            case 'Subhead': {
                if (!libVal.evalIsEmpty(binding.PointDesc)) {
                    propertyValue = binding.PointDesc;
                }
                if ((binding.hasOwnProperty('PRTPoint'))) {
                    if (!libVal.evalIsEmpty(binding.PRTPoint.PointDesc)) {
                        propertyValue = binding.PRTPoint.PointDesc;
                    }
                }
                return propertyValue;
            }
            case 'Footnote': {
                if (!libVal.evalIsEmpty(binding.Point)) {
                    propertyValue = binding.Point;
                }
                if ((binding.hasOwnProperty('PRTPoint'))) {
                    if (!libVal.evalIsEmpty(binding.PRTPoint.Point)) {
                        propertyValue = binding.PRTPoint.Point;
                    }
                }
                return propertyValue;
            }
            case 'Title':
                if (binding.IsPrevReading === 'X') {
                    propertyValue = sectionProxy.formatNumber(binding.PrevReadingValue);
                    
                    if (!libVal.evalIsEmpty(binding.PRTPoint)) {
                        if (!libVal.evalIsEmpty(binding.PRTPoint.UoM)) {
                            propertyValue += ` ${binding.PRTPoint.UoM}`;
                        }
                    } else {
                        if (!libVal.evalIsEmpty(binding.UoM)) {
                            propertyValue += ` ${binding.UoM}`;
                        }
                    }
                }

                if (!libVal.evalIsEmpty(binding.PrevValuationCode)) {
                    propertyValue = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.PrevValuationCode, binding.PrevCodeDescription);
                }
                
                return propertyValue;

            case 'StatusText':
                if (binding.IsPrevReading === 'X' && !libVal.evalIsEmpty(binding.PrevReadingDate)) {
                    let dateTime = new OffsetODataDate(sectionProxy,binding.PrevReadingDate, binding.PrevReadingTime);
                    return sectionProxy.formatDatetime(dateTime.date());
                }
                return propertyValue;
            case 'SubstatusText':
                if (binding.IsPrevReading === 'X' && !libVal.evalIsEmpty(binding.PrevReadBy))  {
                    propertyValue = binding.PrevReadBy;
                }
                return propertyValue;
            default:
                return propertyValue;
        }
    }

    /**
    * Formats the measuring points list
    */
    static measuringPointListFieldFormat(sectionProxy) {
        var section = sectionProxy.getName();
        let property = sectionProxy.getProperty();
        var binding = sectionProxy.binding;
        var value = '';
        var decimal = Number(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());

        if (section === 'MeasuringPointsList') {

            let readLink = binding['@odata.readLink'] + '/MeasurementDocs';
            if ((binding.hasOwnProperty('PRTPoint'))) {
                readLink = binding.PRTPoint['@odata.readLink'] + '/MeasurementDocs';
            }

            if (!libVal.evalIsEmpty(readLink)) {
                return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$top=1&$orderby=ReadingTimestamp desc').then( data => {
                    var point;
                    if (data && (point = data.getItem(0))) {
                        switch (property) {
                            case 'StatusText': {
                                let dateTime = new OffsetODataDate(sectionProxy,point.ReadingDate, point.ReadingTime);
                                return sectionProxy.formatDatetime(dateTime.date());
                            }
                            case 'Title': {
                                if (point.HasReadingValue === 'X') {
                                    value = point.ReadingValue;
                                    value = sectionProxy.formatNumber(value, '', {maximumFractionDigits: decimal})+ ' ' + point.UOM;
                                }
                                if (point.HasReadingValue === 'X' && binding.hasOwnProperty('UoM')) {
                                    value = point.ReadingValue;
                                    value = sectionProxy.formatNumber(value, '', {maximumFractionDigits: decimal}) + ' ' + binding.UoM;
                                }
                                if (point.HasReadingValue === 'X' && !libVal.evalIsEmpty(binding.PRTPoint) && binding.PRTPoint.hasOwnProperty('UoM')) {
                                    value = point.ReadingValue;
                                    value = sectionProxy.formatNumber(value, '', {maximumFractionDigits: decimal}) + ' ' + binding.PRTPoint.UoM;
                                }
                                if (!libVal.evalIsEmpty(point.ValuationCode)) {
                                    if (!libVal.evalIsEmpty(value)) {
                                        value = value + ': ';
                                    }
                                    value = value + libForm.getFormattedKeyDescriptionPair(sectionProxy, point.ValuationCode, point.CodeShortText);
                                }
                                return value;
                            }
                            case 'SubstatusText': {
                                if (!libVal.evalIsEmpty(point.ReadBy)) {
                                    value = point.ReadBy;
                                }
                                return value;
                            }
                            case 'Subhead': {
                                if (!libVal.evalIsEmpty(binding.PointDesc)) {
                                    value = binding.PointDesc;
                                }
                                if ((binding.hasOwnProperty('PRTPoint'))) {
                                    if (!libVal.evalIsEmpty(binding.PRTPoint.PointDesc)) {
                                        value = binding.PRTPoint.PointDesc;
                                    }
                                }
                                return value;
                            }
                            case 'Footnote': {
                                if (!libVal.evalIsEmpty(binding.Point)) {
                                    value = binding.Point;
                                }
                                if ((binding.hasOwnProperty('PRTPoint'))) {
                                    if (!libVal.evalIsEmpty(binding.PRTPoint.Point)) {
                                        value = binding.PRTPoint.Point;
                                    }
                                }
                                return value;
                            }
                            default:
                                return value;
                        }
                    } else {
                        return libThis.measuringPointFieldFormat(sectionProxy);
                    }
                }, error => {
                    /**Implementing our Logger class*/
                    Logger.error(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), error);
                    return value;
                });
            }
        }
        return value;
    }

    /**
     * Formats a date/time string that is sortable by OData
     */
    static getMeasuringDocumentTimestamp(context, dateTime) {
        let dt = libCom.DateTimeToBackendDateTime(context, dateTime);

        return dt;
    }

    /**
     * Refresh the point details page and run toast message after measuring point reading save
     */
    static createPointReadingSuccessMessage(proxyAPI) {
        try {

            let pageProxy = proxyAPI.evaluateTargetPathForAPI('#Page:MeasuringPointDetailsPage');
            let section = pageProxy.getControl('SectionedTable');
            if (section) {
                section.redraw();
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(proxyAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasuringPoints.global').getValue(), 'CreatePointReadingSuccessMessage Error: ' + err);
        }
        libCom.setStateVariable(proxyAPI, 'ObjectCreatedName', 'Reading');
        proxyAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
    }

}
