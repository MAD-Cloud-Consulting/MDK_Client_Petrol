import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libThis from './PartLibrary';
import libForm from '../Common/Library/FormatLibrary';
import Constants from '../Common/Library/ConstantsLibrary';
import Logger from '../Log/Logger';
import ODataDate from '../Common/Date/ODataDate';
import pageCaptionCount from '../Common/PageCaptionCount';
import isSerialized from './Issue/SerialParts/SerialPartsAreAllowed';
import {SplitReadLink} from '../Common/Library/ReadLinkUtils';
import libLocal from '../Common/Library/LocalizationLibrary';

export default class {
    //*************************************************************
    // Create/Update Part
    //*************************************************************

    /**
     * Runs when a tracked field on the part add/edit screen is changed
     */
    static partCreateUpdateOnChange(control) {
        let controlName = control.getName();
        let context = control.getPageProxy();
        let controls = libCom.getControlDictionaryFromPage(context);

        switch (controlName) {
            case Constants.PartCategoryLstPkr:
                //Text item
                if (libThis.evalIsTextItem(context, controls)) {

                    libThis.partCreateUpdateFieldVisibility(context, controls);
                    // if it's a text item we will not have "Select Material" screen and the total count of the number of screen in the wizard will decreases from 3 to 2
                    libCom.setStateVariable(context, 'TotalPageCount',control.getGlobalDefinition('/SAPAssetManager/Globals/PageCounts/PartCreateTextItemCount.global').getValue());
                    //Material item
                } else {
                    libCom.setStateVariable(context, 'TotalPageCount',control.getGlobalDefinition('/SAPAssetManager/Globals/PageCounts/PartCreateCount.global').getValue());
                    libThis.partCreateUpdateFieldVisibility(context, controls);
                }
                pageCaptionCount(control.getPageProxy(), 'search_part');
                break;
            case Constants.PlantListPickerKey:
                //On plant change, re-filter storage location by Plant
                try {
                    let materialLstPkrSpecifier = controls.MaterialLstPkr.getTargetSpecifier();
                    let materialLstPkrQueryOptions = '$orderby=MaterialNum&$expand=Material';
                    let plant = '';

                    if (!libVal.evalIsEmpty(controls.PlantLstPkr.getValue())) {
                        plant = libCom.getListPickerValue(controls.PlantLstPkr.getValue());
                    }
                    controls.MaterialLstPkr.setValue('');
                    materialLstPkrQueryOptions += `&$filter=Plant eq '${plant}'`;
                    materialLstPkrSpecifier.setQueryOptions(materialLstPkrQueryOptions);
                    controls.MaterialLstPkr.setTargetSpecifier(materialLstPkrSpecifier);
                } catch (err) {
                    /**Implementing our Logger class*/
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.partCreateUpdateOnChange(PlantLstPkr) error: ${err}`);
                }
                break;
            case Constants.MaterialListPickerKey:
                //On material change, re-filter MaterialUOMLstPkr by material
                try {
                    let materialUOMLstPkrSpecifier = controls.MaterialUOMLstPkr.getTargetSpecifier();
                    let materialUOMLstPkrQueryOptions = '$select=UOM&$orderby=UOM';
                    let material = '';

                    if (!libVal.evalIsEmpty(controls.MaterialLstPkr.getValue())) {
                        material = libCom.getListPickerValue(controls.MaterialLstPkr.getValue());
                    }
                    controls.MaterialUOMLstPkr.setValue('');
                    materialUOMLstPkrQueryOptions += `&$filter=MaterialNum eq '${material}'`;
                    materialUOMLstPkrSpecifier.setQueryOptions(materialUOMLstPkrQueryOptions);
                    controls.MaterialUOMLstPkr.setTargetSpecifier(materialUOMLstPkrSpecifier);
                } catch (err) {
                    /**Implementing our Logger class*/
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(MaterialLstPkr) error: ${err}`);
                }
                break;
            default:
                break;
        }
    }
    static partSummaryCreateUpdateOnPageLoad(context) {
        pageCaptionCount(context, 'part_summary');
       return this.partOnPageLoad(context);
    }

    /**
     * Sets the initial values for fields when the screen is loaded
     */
    static partCreateUpdateFieldValues(context, controls) {
        let binding = context.binding;
        let partCatValue;
        let stockItemCode = libCom.getAppParam(context, 'PART', 'StockItemCategory');
        let stockItemDescription = context.localizeText('stock_item');
        let textItemCode = libCom.getAppParam(context, 'PART', 'TextItemCategory');
        let textItemDescription = context.localizeText('text_item');

        //Default to stock item on create, else use saved value
        if (binding.hasOwnProperty('ItemCategory')) {
            if (binding.ItemCategory === stockItemCode) {
                partCatValue = libForm.getFormattedKeyDescriptionPair(context,stockItemCode,stockItemDescription);
                controls.PartCategoryLstPkr.setValue(partCatValue);
            } else {
                partCatValue = libForm.getFormattedKeyDescriptionPair(context,textItemCode,textItemDescription);
                controls.PartCategoryLstPkr.setValue(partCatValue);
            }
        } else {
            partCatValue = libForm.getFormattedKeyDescriptionPair(context,stockItemCode,stockItemDescription);
            controls.PartCategoryListPkr.setValue(partCatValue);
        }
    }

    /**
     * Sets the visibility state for fields when the screen is loaded
     */
    static partCreateUpdateFieldVisibility(context, controls) {
        //Text item
        if (libThis.evalIsTextItem(context, controls)) {
            controls.TextItemSim.setVisible(true);
            controls.MaterialLstPkr.setVisible(false);
            controls.MaterialUOMLstPkr.setVisible(false);
            controls.UOMSim.setVisible(false);
            //Material item
        } else {
            controls.TextItemSim.setVisible(false);
            controls.MaterialLstPkr.setVisible(true);
            controls.MaterialUOMLstPkr.setVisible(true);
            controls.UOMSim.setVisible(false);
        }
    }

    /**
     * handle error and warning processing for Part create/update
     */
    static vehiclePartCreateUpdateValidation(pageClientAPI) {

        var dict = libCom.getControlDictionaryFromPage(pageClientAPI);

        libCom.setInlineControlErrorVisibility(dict.QuantitySim, false);
        libCom.setInlineControlErrorVisibility(dict.PlantLstPkr, false);
        libCom.setInlineControlErrorVisibility(dict.StorageLocationLstPkr, false);
        libCom.setInlineControlErrorVisibility(dict.OperationLstPkr, false);
        libCom.setInlineControlErrorVisibility(dict.Order, false);
        libCom.setInlineControlErrorVisibility(dict.MaterialLstPkr,false);
        libCom.setInlineControlErrorVisibility(dict.MaterialUOMLstPkr,false);

        let validations = [];

        validations.push(libThis.validateQuantityGreaterThanZero(pageClientAPI, dict));
        validations.push(libThis.validatePlantNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateStorageLocationNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateUOMNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateOrderNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateOperationNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateQuantityIsNumeric(pageClientAPI, dict));
        validations.push(libThis.validateMaterialNotBlank(pageClientAPI, dict));

        return Promise.all(validations).then(function() {
            return libThis.offlineUnrestictedQty(pageClientAPI, dict);

        }).catch(function() {
            // Errors exist
            return Promise.resolve(false);
        });
    }
    static partCreateUpdateValidation(pageClientAPI) {

        var dict = libCom.getControlDictionaryFromPage(pageClientAPI);

        dict.QuantitySim.clearValidation();
        dict.PlantLstPkr.clearValidation();
        dict.StorageLocationLstPkr.clearValidation();
        dict.OperationLstPkr.clearValidation();
        dict.Order.clearValidation();
        dict.OperationLstPkr.clearValidation();
        dict.UOMSim.clearValidation();
        dict.MaterialLstPkr.clearValidation();
        dict.MaterialUOMLstPkr.clearValidation();
        if (dict.TextItemSim && dict.TextItemSim.visible) {
            dict.TextItemSim.clearValidation();
        }
        //libCom.setInlineControlErrorVisibility(dict.TextTypeDesc, false); //Inline error for simple property is not supported

        //Clear validation will refresh all fields on screen
        ///dict.MaterialLstPkr.clearValidation();
        let validations = [];

        validations.push(libThis.validateQuantityGreaterThanZero(pageClientAPI, dict));
        validations.push(libThis.validatePlantNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateStorageLocationNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateUOMExceedsLength(pageClientAPI, dict));
        validations.push(libThis.validateUOMNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateOrderNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateOperationNotBlank(pageClientAPI, dict));
        validations.push(libThis.validateQuantityIsNumeric(pageClientAPI, dict));
        validations.push(libThis.validateMaterialNotBlank(pageClientAPI, dict));
        if (dict.TextItemSim && dict.TextItemSim.visible) {
            validations.push(libThis.validatetextTypeDescNotBlank(pageClientAPI, dict));
            validations.push(libThis.validateTextItemLength(pageClientAPI,dict));
        }
        //let textTypeDescNotBlank = libThis.validatetextTypeDescNotBlank(pageClientAPI, dict); //Inline error for simple property is not supported

        return Promise.all(validations).then(function() {
            // No errors. Check Online Unrestricted Quantity
            if (pageClientAPI.binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
                return libThis.offlineUnrestictedQty(pageClientAPI, dict);
            } else {
                return libThis.onlineUnrestictedQty(pageClientAPI, dict);
            }
        }).catch(function() {
            // Errors exist
            return Promise.resolve(false);
        });
    }
    /**
     * Sets values for part create/update properties before writing to the data store using OData service.
     * @param {*} context The context proxy depending on where this rule is being called from.
     * @param {String} key The PartCreate.action property name.
     */
    static partCreateUpdateSetODataValue(context, key) {
        var controls = libCom.getControlDictionaryFromPage(context);
        let isTextItem = (context.evaluateTargetPath('#Control:PartCategoryLstPkr').getValue()[0].ReturnValue === libCom.getAppParam(context, 'PART', 'TextItemCategory'));
        let materialNum = '';
        if (!isTextItem) {
            if (context.binding) {
                if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
                    materialNum =  libCom.getListPickerValue(controls.MaterialLstPkr.getValue());
                } else {
                    if (libCom.isDefined(libCom.getListPickerValue(controls.MaterialLstPkr.getValue()))) {
                        materialNum = SplitReadLink(libCom.getListPickerValue(controls.MaterialLstPkr.getValue())).MaterialNum;
                    }
                }
            } else {
                if (libCom.isDefined(libCom.getListPickerValue(controls.MaterialLstPkr.getValue()))) {
                    materialNum = SplitReadLink(libCom.getListPickerValue(controls.MaterialLstPkr.getValue())).MaterialNum;
                }
            }
        }
        let operationNo = libCom.getListPickerValue(controls.OperationLstPkr.getValue());
        let orderID = libCom.getListPickerValue(controls.Order.getValue());
        switch (key) {
            case Constants.ItemCategoryKey:
                if (isTextItem) {
                    return libCom.getAppParam(context, 'PART', 'TextItemCategory');
                } else {
                    return libCom.getAppParam(context, 'PART', 'StockItemCategory');
                }
            case Constants.ItemCategoryDescKey:
                if (isTextItem) {
                    return context.localizeText('text_item');
                } else {
                    return context.localizeText('stock_item');
                }
            case Constants.OperationNoKey:
                return operationNo;
            case Constants.MaterialNumKey:
                return materialNum;
            case Constants.WorkOrderKey:
                return orderID;
            case Constants.TransactionID:
                return context.binding.OrderId;
            case Constants.PlantKey:
                return libCom.getListPickerValue(controls.PlantLstPkr.getValue());
            case Constants.UnitOfEntryKey:
                if (isTextItem) {
                    return controls.UOMSim.getValue();
                } else {
                    return libCom.getListPickerValue(controls.MaterialUOMLstPkr.getValue());
                }
            case Constants.ComponentDescKey:
                return libThis.getPartDescription(context, materialNum);
            case Constants.OperationDescKey: {
                return libThis.getOperationDescription(context, operationNo, orderID);
            }
            case Constants.RequirementQuantityKey: {
                return libLocal.toNumber(context, context.evaluateTargetPath('#Control:QuantitySim/#Value')) || 0;
            }
            case Constants.BatchKey: {
                return libCom.getListPickerValue(controls.BatchNumberLstPkr.getValue()) || '';
            }
            case Constants.CreateLinksKey: {
                let createLinks = [];
                let batch;
                if (controls.BatchNumberLstPkr) {
                    batch = libCom.getListPickerValue(controls.BatchNumberLstPkr.getValue());
                }
                if (batch) {
                    let plant = libCom.getListPickerValue(controls.PlantLstPkr.getValue());
                    let batchReadLink = `MaterialBatches(Batch='${batch}',Plant='${plant}',MaterialNum='${materialNum}')`;
                    let createLink = context.createLinkSpecifierProxy('MaterialBatch_Nav', 'MaterialBatches', '', batchReadLink);
                    createLinks.push(createLink.getSpecifier());
                }

                //This link is needed to successfully add a local component to a local operation of a local work order in the SAP backend during sync.
                let operationCreateLink = context.createLinkSpecifierProxy('WOOperation', 'MyWorkOrderOperations', '$filter=OrderId eq \'' + orderID + '\' and OperationNo eq \'' + operationNo + '\'' , '');
                createLinks.push(operationCreateLink.getSpecifier());

                //This link is needed to be able to navigate from a local work order to its parts list.
                let woCreateLink = context.createLinkSpecifierProxy('WOHeader', 'MyWorkOrderHeaders', '$filter=OrderId eq \'' + orderID + '\'', '');
                createLinks.push(woCreateLink.getSpecifier());

                return createLinks;
            }
            case Constants.UpdateLinksKey: {
                let updateLinks = [];

                let batch = libCom.getListPickerValue(controls.BatchNumberLstPkr.getValue());
                if (batch) {
                    let plant = libCom.getListPickerValue(controls.PlantLstPkr.getValue());
                    let batchReadLink = `MaterialBatches(Batch='${batch}',Plant='${plant}',MaterialNum='${materialNum}')`;
                    let createLink = context.createLinkSpecifierProxy('MaterialBatch_Nav', 'MaterialBatches', '', batchReadLink);
                    updateLinks.push(createLink.getSpecifier());
                }

                return updateLinks;
            }
            case Constants.DeleteLinksKey: {
                let deleteLinks = [];

                let batch = libCom.getListPickerValue(controls.BatchNumberLstPkr.getValue());
                if (context.binding.MaterialBatch_Nav && !batch) {
                    deleteLinks.push(context.binding.MaterialBatch_Nav['@odata.readLink']);
                }

                return deleteLinks;
            }
            default:
                return '';
        }
    }

    /**
     * Gets the material description given the part id.
     *
     * @param {*} context The context proxy depending on where this rule is being called from.
     * @param {String} partId The material part id.
     */
    static getPartDescription(context, partId) {
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service', `Materials('${partId}')`, [],
            '$select=Description').then(result => {
                if (!libVal.evalIsEmpty(result)) {
                    //Grab the first row (should only ever be one row)
                    return result.getItem(0).Description;
                } else {
                    return '';
                }
            }, err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.getPartDescription() OData read error: ${err}`);
                return '';
            });
    }

    /**
     * Gets the operation description given the operation id and work order id
     *
     * @param {*} context The context proxy depending on where this rule is being called from.
     * @param {String} operationNum The operation number.
     * @param {String} workOrderId Work order id.
     */
    static getOperationDescription(context, operationNum, workOrderId) {
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OperationNo='${operationNum}',OrderId='${workOrderId}')`, [],
            '$select=OperationShortText').then(result => {
                if (!libVal.evalIsEmpty(result)) {
                    //Grab the first row (should only ever be one row)
                    return result.getItem(0).OperationShortText;
                } else {
                    return '';
                }
            }, err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.getOperationDescription() OData read error: ${err}`);
                return '';
            });
    }


    //*************************************************************
    // Issue Part Create/Update
    //*************************************************************


    /**
     * Runs when the part issue add/edit screen is loaded
     */
    static PartIssueCreateUpdateOnPageLoad(pageClientAPI) {

        libThis.partIssueCreateUpdateFieldValues(pageClientAPI);
        libThis.partIssueCreateUpdateCalculateQuantity(pageClientAPI);
    }

    /**
     * Runs when the part return screen is loaded
     */
    static PartReturnOnPageLoad(pageClientAPI) {

        libThis.partIssueCreateUpdateFieldValues(pageClientAPI);
    }

    static partIssueUpdateFormattedValues(pageClientAPI) {
        let dict = {};
        dict = libCom.getControlDictionaryFromPage(pageClientAPI);
        let binding = '';
        if (pageClientAPI.binding.RelatedItem) {
            binding = pageClientAPI.binding.RelatedItem[0];
        } else {
            binding = pageClientAPI.binding;
        }
        dict.AutoGenerateSerialNumberSwitch.setVisible(false);
        dict.AutoGenerateSingleProperty.setVisible(false);
        dict.SerialNumLstPkr.setVisible(false);
        dict.StorageLocationLstPkr.setValue(binding.StorageLocation);
        libThis.IsSerialPart(pageClientAPI, binding.Material).then(result => {
            if (result) {
                dict.AutoGenerateSerialNumberSwitch.setVisible(true);
                dict.AutoGenerateSingleProperty.setVisible(false);
                dict.SerialNumLstPkr.setVisible(true);
            }
        });
        libThis.getSerialPartsForUpdate(pageClientAPI, pageClientAPI.binding.RelatedItem[0]['@odata.readLink']).then(result => {
            dict.SerialNumLstPkr.setValue(result);
        });
        libThis.getPlantPlusDescription(pageClientAPI, binding.Plant).then(result => {
            dict.PlantSim.setValue(result);
        });
        libThis.getPartDescription(pageClientAPI, binding.Material).then(result => {
            dict.MaterialSim.setValue(libForm.getFormattedKeyDescriptionPair(pageClientAPI, binding.Material, result));
        });
    }

    static SerialPartsIssueUpdateEntitySet(pageClientAPI) {
        let binding = '';
        if (pageClientAPI.binding.RelatedItem) {
            binding = pageClientAPI.binding.RelatedItem[0];
        } else {
            binding = pageClientAPI.binding;
        }
        return `Materials('${binding.Material}')/SerialNumbers`;
    }

    static IsSerialPart(context, partId) {
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service', `Materials('${partId}')/WorkOrderComponent`, [],
            '').then(result => {
                if (!libVal.evalIsEmpty(result)) {
                    //Grab the first row (should only ever be one row)
                    return !libVal.evalIsEmpty(result.getItem(0).SerialNoProfile);
                } else {
                    return false;
                }
            }, err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.getPartDescription() OData read error: ${err}`);
                return '';
            });
    }

    static getSerialPartsForUpdate(context, entitySet) {
        let returnValue = [];
        return context.read(
            '/SAPAssetManager/Services/AssetManager.service', `${entitySet}/SerialNum`, [],
            "$orderby=SerialNumber&$filter=Issued eq ''").then(result => {
                if (!libVal.evalIsEmpty(result)) {
                    //Grab the first row (should only ever be one row)
                    //return !libVal.evalIsEmpty(result.getItem(0).SerialNoProfile)
                    //return '';
                    result.forEach(function(value) {
                        returnValue.push({DisplayValue: value.SerialNum, ReturnValue: value.SerialNum});
                    });
                    return returnValue;
                } else {
                    return '';
                }
            }, err => {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.getPartDescription() OData read error: ${err}`);
                return '';
            });
    }

    /**
     * Sets the initial values for fields when the screen is loaded
     */
    static partIssueCreateUpdateFieldValues(pageClientAPI) {

        let dict = {};
        dict = libCom.getControlDictionaryFromPage(pageClientAPI);
        let binding = pageClientAPI.binding;

        let textCategory = libCom.getAppParam(pageClientAPI, 'PART', 'TextItemCategory');
        let textDescription = pageClientAPI.localizeText('text_item');

        dict.MaterialSim.setValue(libThis.getPartPlusDescription(pageClientAPI, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum));
        return libThis.getPlantPlusDescription(pageClientAPI, binding.Plant).then(result => {
            dict.PlantSim.setValue(result);
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), err);
            dict.PlantSim.setValue('');
        });
    }

    /**
     * Sets the initial valuefor quantity to issue when the screen is loaded
     * Calcuation is: required - withdrawn (backend) - withdrawn (local issues)
     * @param {*} context
     */
    static partIssueCreateUpdateCalculateQuantity(context) {

        let binding = context.binding;
        let required = Number(binding.QuantityUnE);
        let withdrawn = Number(binding.WithdrawnQuantity);
        let control = libCom.getControlProxy(context, 'QuantitySim');

        return libThis.getLocalQuantityIssued(context, binding).then(result => {
            withdrawn += result;
            if (withdrawn > required) {
                withdrawn = required;
            }
            control.setValue((required - withdrawn).toString());
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), err);
            control.setValue('');
        });
    }

    /**
     * handle error and warning processing for Part create/update
     */
    static partIssueCreateUpdateValidation(pageClientAPI) {

        var dict = libCom.getControlDictionaryFromPage(pageClientAPI);

        libCom.setInlineControlErrorVisibility(dict.StorageLocationLstPkr, false);
        dict.QuantitySim.clearValidation();
        let promises = [];
        promises.push(libThis.validateQuantityGreaterThanZero(pageClientAPI, dict));
        promises.push(libThis.validateQuantityIsNumeric(pageClientAPI, dict));
        promises.push(libThis.validateStorageLocationNotBlank(pageClientAPI, dict));
        promises.push(libThis.validateBatchNotBlank(pageClientAPI, dict));
        let autoSerial = pageClientAPI.evaluateTargetPath('#Control:AutoGenerateSerialNumberSwitch/#Value');
        if (!libVal.evalIsEmpty(pageClientAPI.binding.SerialNoProfile) && !autoSerial) {
            promises.push(libThis.validateSerialNumberNotBlank(pageClientAPI,dict));
        }

        //First process the inline errors
        return Promise.all(promises).then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    }

    /**
     * handle error and warning processing for Part Return
     */
    static partReturnValidation(pageClientAPI) {

        var dict = libCom.getControlDictionaryFromPage(pageClientAPI);

        libCom.setInlineControlErrorVisibility(dict.StorageLocationLstPkr, false);
        libCom.setInlineControlErrorVisibility(dict.SerialNumLstPkr, false);
        dict.QuantitySim.clearValidation();

        let promiseArray = [];
        promiseArray.push(libThis.validateStorageLocationNotBlank(pageClientAPI, dict));

        if (isSerialized(pageClientAPI)) {
            promiseArray.push(libThis.validateSerialNumberNotBlank(pageClientAPI, dict));
        } else {
            promiseArray.push(libThis.validateQuantityGreaterThanZero(pageClientAPI, dict));
            promiseArray.push(libThis.validateQuantityIsNumeric(pageClientAPI, dict));
            promiseArray.push(libThis.validateReturnQtyNotGreaterThanIssueQty(pageClientAPI, dict));
        }

        //First process the inline errors
        return Promise.all(promiseArray).then(function() {
            return true;
        }).catch(function() {
            return false;
        });

    }

    /**
     * Validate that the return quantity is not greater than the issued quantity
     * @param {*} pageClientAPI
     * @param {*} dict
     */
    static validateReturnQtyNotGreaterThanIssueQty(pageClientAPI, dict) {
        let currentWithdrawnQty = libCom.getStateVariable(pageClientAPI, 'CurrentWithdrawnQty', 'PartDetailsPage');

        if (currentWithdrawnQty) {
            let returnQty = Number(dict.QuantitySim.getValue());
            if (returnQty > currentWithdrawnQty) {
                let message = pageClientAPI.localizeText('return_qty_cannot_be_greater_than_issued');
                libCom.executeInlineControlError(pageClientAPI, dict.QuantitySim, message);
                return Promise.reject(false);
            } else {
                return Promise.resolve(true);
            }
        }
        return Promise.reject(false);
    }

    //*************************************************************
    // Validation Rules
    //*************************************************************

    /**
     * UOM be <= length limit defined in global
     */
    static validateUOMExceedsLength(pageClientAPI, dict) {

        //New short text length must be <= global maximum
        let error = false;
        let message;
        let max = libCom.getAppParam(pageClientAPI, 'PART', 'UOMLength');

        if (libThis.evalIsTextItem(pageClientAPI, dict)) {
            if (libThis.evalUOMLengthWithinLimit(dict, max)) {
                return Promise.resolve(true);
            } else {
                error = true;
                let params=[max];
                message = pageClientAPI.localizeText('maximum_field_length',params);
            }
        }
        if (error) {
            libCom.executeInlineControlError(pageClientAPI, dict.UOMSim, message);
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }

    static validateUOMNotBlank(pageClientAPI, dict) {
    if (libCom.isDefined(dict.PartCategoryLstPkr)) {
        if (libThis.evalIsTextItem(pageClientAPI, dict)) {
            return Promise.resolve(true);
        }
    }

        if (!libThis.evalUOMIsEmpty(dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI,dict.MaterialUOMLstPkr, message);
            return Promise.reject();
        }
    }

    /**
     * Plant required for a part
     */
    static validatePlantNotBlank(pageClientAPI, dict) {

        if (!libThis.evalPlantIsEmpty(dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI, dict.PlantLstPkr, message);
            return Promise.reject();
        }
    }

    /**
     * Operation required for a part
     */
    static validateOperationNotBlank(pageClientAPI, dict) {

        if (!libThis.evalOperationIsEmpty(dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI, dict.OperationLstPkr, message);
            return Promise.reject();
        }
    }

    /**
     * Order required for a part
     */
    static validateOrderNotBlank(pageClientAPI, dict) {

        if (!libThis.evalOrderIsEmpty(dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI, dict.Order, message);
            return Promise.reject();
        }
    }

    /**
     * Storage Location required for an issue
     */
    static validateStorageLocationNotBlank(pageClientAPI, dict) {
    if (libCom.isDefined(dict.PartCategoryLstPkr)) {
        if (libThis.evalIsTextItem(pageClientAPI, dict)) {
            return Promise.resolve(true);
        }
    }

        if (!libThis.evalStorageLocationIsEmpty(dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI, dict.StorageLocationLstPkr, message);
            return Promise.reject();
        }
    }

    static validateBatchNotBlank(pageClientAPI, dict) {
        if (libCom.isDefined(dict.BatchNumberLstPkr) && dict.BatchNumberLstPkr.visible) {
            if (libVal.evalIsEmpty(libCom.getListPickerValue(dict.BatchNumberLstPkr.getValue()))) {
                let message = pageClientAPI.localizeText('field_is_required');
                libCom.executeInlineControlError(pageClientAPI, dict.BatchNumberLstPkr, message);
                return Promise.reject();
            }
        }

        return Promise.resolve(true);
    }

    static validateSerialNumberNotBlank(pageClientAPI, dict) {
        let serialNums = pageClientAPI.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
        if (serialNums.length > 0 ) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('field_is_required');
            libCom.executeInlineControlError(pageClientAPI, dict.SerialNumLstPkr, message);
            return Promise.reject();
        }
    }

    /**
     * Quantity must be > 0
     */
    static validateQuantityGreaterThanZero(pageClientAPI, dict) {

        //Quantity > 0?
        if (libThis.evalQuantityGreaterThanZero(pageClientAPI, dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('quantity_must_be_greater_than_zero');
            libCom.executeInlineControlError(pageClientAPI, dict.QuantitySim, message);
            return Promise.reject();
        }
    }

    static validatetextTypeDescNotBlank(pageClientAPI, dict) {

        if (!libThis.evalIsTextItem(pageClientAPI, dict)) {
            return Promise.resolve(true);
        } else {
            if (dict.TextItemSim.getValue() === '') {
                let message = pageClientAPI.localizeText('field_is_required');
                libCom.executeInlineControlError(pageClientAPI, dict.TextItemSim, message);
                return Promise.reject();
            }
            return Promise.resolve(true);
        }
    }

    /**
     * Description for TextItem must not be greater than character limit
     */
    static validateTextItemLength(pageClientAPI, dict) {

        //New short text length must be <= global maximum
        let error = false;
        let message;
        let max = 30;

        if (libThis.evalIsTextItem(pageClientAPI, dict)) {
            if (dict.TextItemSim.getValue().length <= max) {
                return Promise.resolve(true);
            } else {
                error = true;
                let params=[max];
                message = pageClientAPI.localizeText('maximum_field_length',params);
            }
        }
        if (error) {
            libCom.executeInlineControlError(pageClientAPI, dict.TextItemSim, message);
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Part must be selected if text item is not true
     */
    static validateMaterialNotBlank(pageClientAPI, dict) {

        let error = false;
        let message;

        //Not Text item
        if (!libThis.evalIsTextItem(pageClientAPI, dict)) {
            //Item is empty
            if (libThis.evalMaterialIsEmpty(dict)) {
                error = true;
                message = pageClientAPI.localizeText('field_is_required');
            }
        }
        if (error) {
            libCom.executeInlineControlError(pageClientAPI, dict.MaterialLstPkr, message);
            return Promise.reject();
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * Quantity must be numeric
     */
    static validateQuantityIsNumeric(pageClientAPI, dict) {

        //New reading must be a number
        if (libThis.evalQuantityIsNumeric(pageClientAPI, dict)) {
            return Promise.resolve(true);
        } else {
            let message = pageClientAPI.localizeText('validate_numeric_quantity');
            libCom.executeInlineControlError(pageClientAPI, dict.QuantitySim, message);
            return Promise.reject();
        }
    }

    /**
    * Evaluates whether the current UOM length is within length limit
    */
    static evalUOMLengthWithinLimit(dict, limit) {
        return (dict.UOMSim.getValue().length <= Number(limit));
    }

    /**
    * Evaluates whether storage location is empty
    */
    static evalStorageLocationIsEmpty(dict) {
        return (libVal.evalIsEmpty(libCom.getListMultiplePickerValue(dict.StorageLocationLstPkr.getValue())));
    }

    /**
    * Evaluates whether plant is empty
    */
    static evalPlantIsEmpty(dict) {
        return (libVal.evalIsEmpty(libCom.getListPickerValue(dict.PlantLstPkr.getValue())));
    }

    /**
    * Evaluates whether UOM is empty
    */
   static evalUOMIsEmpty(dict) {
        return (libVal.evalIsEmpty(libCom.getListPickerValue(dict.MaterialUOMLstPkr.getValue())));
    }

    /**
    * Evaluates whether operation is empty
    */
    static evalOperationIsEmpty(dict) {
        return (libVal.evalIsEmpty(libCom.getListPickerValue(dict.OperationLstPkr.getValue())));
    }

    /**
    * Evaluates whether order is empty
    */
   static evalOrderIsEmpty(dict) {
    return (libVal.evalIsEmpty(libCom.getListPickerValue(dict.Order.getValue())));
}


    /**
    * Evaluates whether quantity > 0
    */
    static evalQuantityGreaterThanZero(context, dict) {
        return (libLocal.toNumber(context, dict.QuantitySim.getValue()) > 0);
    }

    /**
    * Evaluates whether text item switch control is true
    */
    static evalIsTextItem(context, dict) {
        let partCatValue = libCom.getAppParam(context, 'PART', 'TextItemCategory');
        return (libCom.getListPickerValue(dict.PartCategoryLstPkr.getValue()) === partCatValue);
    }

    /**
    * Evaluates whether Item list picker is empty
    */
    static evalMaterialIsEmpty(dict) {
        return (libVal.evalIsEmpty(libCom.getListPickerValue(dict.MaterialLstPkr.getValue())));
    }

    /**
    * Evaluates whether the current reading is a number
    */
    static evalQuantityIsNumeric(context, dict) {
        return (libLocal.isNumber(context, dict.QuantitySim.getValue()));
    }

    /**
    * Shows a warning if the quantity entered by user is greater than the unrestricted quantity
    */
   static onlineUnrestictedQty(pageClientAPI,dict) {
        if (libCom.isDefined(dict.OnlineSwitch) && libCom.isDefined(dict.MaterialLstPkr.getValue())) {
            /**Check if we are on online mode*/
            if (dict.OnlineSwitch.getValue() === true) {
                return pageClientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service',libCom.getListPickerValue(dict.MaterialLstPkr.getValue()),[],'').then(function(result) {
                    if (result && result.getItem(0)) {
                        /**Show warning if desired qty is greater than unrestricted quantity*/
                        if (Number(dict.QuantitySim.getValue()) > Number(result.getItem(0).UnrestrictedQuantity)) {
                        return pageClientAPI.executeAction('/SAPAssetManager/Actions/Parts/PartAddedWarningMessage.action').then(function(ActionResult) {
                            if (ActionResult.data === true) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
            } else {
                return true;
            }
        } else {
            return true;
        }
   }

    /**
    * Shows a warning if the quantity entered by user is greater than the unrestricted quantity
    */
   static offlineUnrestictedQty(pageClientAPI,dict) {
        if (Number(dict.QuantitySim.getValue()) > Number(dict.AvailableQuantity.getValue())) {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/Parts/PartAddedWarningMessage.action').then(function(ActionResult) {
                if (ActionResult.data === true) {
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            return true;
        }
   }

    /**
    * Sets header values for create/update service before writing OData record
    */
    static partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, key, movementType) {

        //Only create will be supported for now.  SB and HCP SDK cannot support local updates merging into the create.
        //This means that we cannot allow local updates (edits) on a measurement document
        switch (key) {
            case 'DocumentDate':
                return new ODataDate().toDBDateString(pageClientAPI);
            case 'GMCode':
                return libCom.getAppParam(pageClientAPI, 'PART', movementType);
            case 'MaterialDocYear':
                return new ODataDate().toDBDate(pageClientAPI).getFullYear().toString();
            case 'PostingDate':
                return new ODataDate().toDBDateTimeString(pageClientAPI);
            case 'UserName':
                return libCom.getSapUserName(pageClientAPI);
            case 'Batch':
                return libCom.getListPickerValue(libCom.getTargetPathValue(pageClientAPI, '#Control:BatchNumberLstPkr/#Value')) || '';
            default:
                return '';
        }
    }

    /**
    * Sets line item values for create/update service before writing OData record
    */
    static partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, key, movementType) {

        switch (key) {
            case 'OrderNumber':
                return pageClientAPI.evaluateTargetPath('#Property:OrderId');
            case 'MovementType':
                return libCom.getAppParam(pageClientAPI, 'WORKORDER', movementType);
            case 'ReservationNumber':
                return pageClientAPI.evaluateTargetPath('#Property:RequirementNumber');
            case 'ReservationItemNumber':
                return pageClientAPI.evaluateTargetPath('#Property:ItemNumber');
            case 'Material':
                return pageClientAPI.evaluateTargetPath('#Property:MaterialNum');
            case 'Plant':
                return pageClientAPI.evaluateTargetPath('#Property:Plant');
            case 'StorageLocation':
                return libCom.getListPickerValue(libCom.getFieldValue(pageClientAPI, 'StorageLocationLstPkr', '', null, true));
            case 'ValuationType':
                return libCom.getListPickerValue(libCom.getFieldValue(pageClientAPI, 'ValuationTypePicker', '', null, true));
            case 'Quantity':
                return libCom.getFieldValue(pageClientAPI, 'QuantitySim', '', null, true);
            default:
                return '';
        }
    }

    /**
     * Create the OData relationship links for part issue line item row
     * @param {*} pageProxy
     */
    static partIssueCreateLineItemLinks(pageProxy) {

        var links = [];

        //MatDoc_MatDocItem_ASet
        let woLink = pageProxy.createLinkSpecifierProxy(
            'AssociatedMaterialDoc',
            'MaterialDocuments',
            '',
            'pending_1'
        );
        links.push(woLink.getSpecifier());

        return links;
    }

    /**
    * Formats the field formats for various part screens
    */
    static partFieldFormat(sectionProxy, key = '') {
        let section = sectionProxy.getName();
        let property = sectionProxy.getProperty();
        let binding = sectionProxy.binding;

        let textCategory = libCom.getAppParam(sectionProxy, 'PART', 'TextItemCategory');
        let textDescription = sectionProxy.localizeText('text_item');
        let format = '';

        switch (section) {
            case 'PartsList':
                switch (property) {
                    case 'Title':
                        format = libThis.getPartPlusDescription(sectionProxy, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum, false);
                        break;
                    case 'Subhead':
                        format = libThis.getPartPlusDescription(sectionProxy, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum, true, false);
                        break;
                    case 'SubstatusText':
                        return libThis.getLocalQuantityIssued(sectionProxy, binding).then(result => {
                            return sectionProxy.localizeText('issued_parts_count',[sectionProxy.formatNumber(Number(binding.WithdrawnQuantity + result)),sectionProxy.formatNumber(binding.QuantityUnE),binding.UnitOfEntry]);

                        }).catch(err => {
                            /**Implementing our Logger class*/
                            Logger.error(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), err);
                            return sectionProxy.localizeText('issued_parts_count',[binding.WithdrawnQuantity,binding.QuantityUnE,binding.UnitOfEntry]);
                        });
                    case 'Footnote':
                        format = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.OperationNo, binding.OperationDesc);
                        break;
                    default:
                        break;
                }
                break;
            case 'RelatedStep':
                switch (property) {
                    case 'Description':
                        format = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.OperationNo, binding.OperationShortText);
                        break;
                    default:
                        break;
                }
                break;
            case 'KeyValuePairs':
                switch (key) {
                    case 'CommittedQty':
                        format = sectionProxy.formatNumber(binding.CommittedQuantity) + ' ' + binding.UnitOfEntry;
                        break;
                    case 'Description':
                        format = libThis.getPartPlusDescription(sectionProxy, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum, false);
                        break;
                    case 'WithdrawnQty':
                        return libThis.getLocalQuantityIssued(sectionProxy, binding).then(result => {
                            libCom.setStateVariable(sectionProxy, 'CurrentWithdrawnQty', Number(binding.WithdrawnQuantity + result), 'PartDetailsPage');
                            return sectionProxy.formatNumber(Number(binding.WithdrawnQuantity + result)) + ' ' + binding.UnitOfEntry;
                        }).catch(err => {
                            /**Implementing our Logger class*/
                            Logger.error(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), err);
                            return '';
                        });
                    case 'RequiredQty':
                        format = sectionProxy.formatNumber(binding.QuantityUnE) + ' ' + binding.UnitOfEntry;
                        break;
                    case 'StockType':
                        format = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.ItemCategory, binding.ItemCategoryDesc);
                        break;
                    case 'Plant':
                        return libThis.getPlantPlusDescription(sectionProxy, binding.Plant).then(result => {
                            return result;
                        }).catch(err => {
                            /**Implementing our Logger class*/
                            Logger.error(sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), err);
                            return '';
                        });
                    case 'Bin':
                        return sectionProxy.read(
                            '/SAPAssetManager/Services/AssetManager.service',
                            binding['@odata.readLink'] + '/Material/MaterialSLocs',
                            [],
                            "$select=StorageBin&$filter=Plant eq '" + binding.Plant + "' and StorageLocation eq '" + binding.StorageLocation + "'").then(result => {
                                if (result && result.length > 0) {
                                    // Grab the first row (should only ever be one row) and return StorageBin
                                    return result.getItem(0).StorageBin;
                                } else {
                                    return '-';
                                }
                            });
                    case 'Batch':
                        return sectionProxy.read(
                            '/SAPAssetManager/Services/AssetManager.service',
                            binding['@odata.readLink'] + '/Material/MaterialSLocs',
                            [],
                            "$select=BatchIndicator&$filter=Plant eq '" + binding.Plant + "' and StorageLocation eq '" + binding.StorageLocation + "'").then(result => {
                                if (result && result.length > 0) {
                                    // Grab the first row (should only ever be one row)
                                    let row = result.getItem(0);
                                    return row.BatchIndicator;
                                } else {
                                    return '-';
                                }
                            });
                    case 'Location':
                        if (!libVal.evalIsEmpty(binding.StorageLocation)) {
                            var locationValue = '';
                            return sectionProxy.read(
                                '/SAPAssetManager/Services/AssetManager.service',
                                'MaterialSLocs',
                                [],
                                "$select=StorageLocationDesc&$filter=Plant eq '" + binding.Plant + "' and StorageLocation eq '" + binding.StorageLocation + "' and MaterialNum eq '" + binding.MaterialNum + "'").then(result => {
                                    if (result && result.length > 0) {
                                        //Grab the first row (should only ever be one row)
                                        let row = result.getItem(0);
                                        locationValue = libForm.getFormattedKeyDescriptionPair(sectionProxy, binding.StorageLocation, row.StorageLocationDesc);
                                    }
                                    return locationValue;
                                });

                        } else {
                            break;
                        }
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return format;
    }

    /**
     * Get the part and description for display
     */
    static getPartPlusDescription(context, itemCategory, textCategory, textTypeDesc, textDescription, materialDescription, materialNum, part = true, description = true) {
        if (itemCategory === textCategory) {
            if (!libVal.evalIsEmpty(textTypeDesc)) {
                if (part && description) {
                    return libForm.getFormattedKeyDescriptionPair(context, textDescription, textTypeDesc);
                } else if (part) {
                    return textDescription;
                } else {
                    return textTypeDesc;
                }
            } else {
                return (part) ? textDescription : '';
            }
        } else {
            if (!libVal.evalIsEmpty(materialDescription)) {
                if (part && description) {
                    return libForm.getFormattedKeyDescriptionPair(context, materialNum, materialDescription);
                } else if (part) {
                    return materialNum;
                } else {
                    return materialDescription;
                }
            } else {
                return (part) ? materialNum : '';
            }
        }
    }

    static getPlantPlusDescription(proxy, plant) {
        var plantValue = '';
        try {
            return proxy.read(
                '/SAPAssetManager/Services/AssetManager.service',
                `Plants('${plant}')`,
                [],
                '$select=PlantDescription').then(result => {
                    if (result && result.length > 0) {
                        //Grab the first row (should only ever be one row)
                        let row = result.getItem(0);
                        plantValue = libForm.getFormattedKeyDescriptionPair(proxy, plant, row.PlantDescription);
                    }
                    return Promise.resolve(plantValue);
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Reads the local material document lines for the current workorder part to get the issued quantity for display
     * Takes into account the amount issued and returned locally
     * @param {*} context
     * @param {*} binding
     */
    static getLocalQuantityIssued(context, binding) {
        let count = 0;
        try {
            return context.read(
                '/SAPAssetManager/Services/AssetManager.service',
                'MaterialDocItems',
                ['EntryQuantity', 'MovementType'],
                `$filter=sap.islocal() and OrderNumber eq '${binding.OrderId}' and ReservationItemNumber eq '${binding.ItemNumber}' and ReservationNumber eq '${binding.RequirementNumber}'`).then(localMatDocItems => {
                    if (localMatDocItems && localMatDocItems.length > 0) {
                        for (let x = 0; x < localMatDocItems.length; x++) {
                            if (localMatDocItems.getItem(x).MovementType === libThis.getGoodsIssueMovementType(context)) {
                                count += localMatDocItems.getItem(x).EntryQuantity;
                            } else if (localMatDocItems.getItem(x).MovementType === libThis.getGoodsReturnMovementType(context)) {
                                count -= localMatDocItems.getItem(x).EntryQuantity;
                            }
                        }

                    }
                    return Promise.resolve(count);
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static getGoodsIssueMovementType(context) {
        return libCom.getAppParam(context, 'WORKORDER', 'MovementType');
    }

    static getGoodsReturnMovementType(context) {
        return libCom.getAppParam(context, 'WORKORDER', 'GoodsReturnMovementType');
    }

    /**
     * Refresh the part details page and run toast message after point issue change set save
     */
    static createPartIssueSuccessMessage(context) {
        try {
            let pageProxy = libCom.getStateVariable(context, 'PartDetailsPageRefresh');
            let section = pageProxy.getControl('SectionedTable');
            if (section) {
                section.redraw();
            }
            libCom.setStateVariable(context, 'PartDetailsPageRefresh', undefined);
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),'createPartIssueSuccessMessage Error: ' + err);
        }
    }

    /**
     * Save the part details page to state variabe, and finish the change set by closing the modal screen
     * @param {*} context
     */
    static partIssueCreateLineItemSuccess(context) {
        context.getClientData().isIssue = true;
        if (context.currentPage.previousPage.id !== 'BarcodeScannerExtensionControl') {
            let pageProxy = context.evaluateTargetPathForAPI('#Page:PartDetailsPage');
            libCom.setStateVariable(context, 'PartDetailsPageRefresh', pageProxy);
        }
        let AutoSerializedSwitchValue = context.evaluateTargetPath('#Control:AutoGenerateSerialNumberSwitch/#Value');
        let SerialNums = context.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
        if (AutoSerializedSwitchValue  === false) {
            libCom.setStateVariable(context, 'SerialParts', SerialNums);
            libCom.setStateVariable(context, 'SerialPartsCounter', -1);
            this.SerialPartLoop(context);
        } else {
            context.executeAction('/SAPAssetManager/Actions/Parts/PartIssueSuccessClose.action');
        }
    }

    /**
     * Save the part details page to state variable, and finish the change set by closing the modal screen
     * @param {*} context
     */
    static partReturnCreateLineItemSuccess(context) {
        let serialNums = context.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
        if (serialNums.length > 0) {
            libCom.setStateVariable(context, 'SerialParts', serialNums);
            libCom.setStateVariable(context, 'SerialPartsCounter', -1);
            this.SerialPartLoop(context);
        } else {
            libCom.setStateVariable(context, 'ObjectCreatedName', 'Item');
            context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        }
    }


    static SerialPartLoop(context) {
        const serialParts = libCom.getStateVariable(context, 'SerialParts');
        let counter = libCom.getStateVariable(context, 'SerialPartsCounter');
        counter++;
        if (counter === serialParts.length) {
            if (context.getClientData().isIssue) {
                return context.executeAction('/SAPAssetManager/Actions/Parts/PartIssueSuccessClose.action');
            } else {
                context.dismissActivityIndicator();
                return context.executeAction('/SAPAssetManager/Actions/Parts/PartReturnSuccessClose.action');
            }
        } else {
            libCom.setStateVariable(context, 'SerialPartsCounter',counter);
            return context.executeAction('/SAPAssetManager/Actions/Parts/MatDocItemSerialNumsCreate.action');
        }

    }

    /**
     * Create the query options for a part add/edit.  This is required because we can add/edit from different screens and parent object context changes
     * @param {*} context
     */
    static partUOMQueryOptions(context) {
        let binding = context.binding;
        let query = "$select=UOM&$orderby=UOM&$filter=MaterialNum eq ''";

        if (binding.hasOwnProperty('MaterialNum')) {
            if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
                query = `$select=UOM&$orderby=UOM&$filter=MaterialNum eq '${context.binding.Component}'`;
            } else {
                query = `$select=UOM&$orderby=UOM&$filter=MaterialNum eq '${context.binding.MaterialNum}'`;
            }
        }
        return query;
    }

}

