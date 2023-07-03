import { unzip } from '../ZipUtil';
import * as fs from '@nativescript/core/file-system';
import * as xmlModule from '@nativescript/core/xml';
import Logger from '../../Log/Logger';
import IsAndroid from '../../Common/IsAndroid';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libForms from './FSMSmartFormsLibrary';
import FSMSmartFormsLibrary from './FSMSmartFormsLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';

var fieldsInVisibilityRules = {};
let fsmFormInstance = null;
let isClosed = false;
let hasCloudID = false;
let isEditable = true;

export default async function FSMFormPageNav(context) {
    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/Forms/SingleForm.page');
    if (!ApplicationSettings.hasKey(context, 'XMLTemplateParsed')) { // dont parsed the XML when moving from one chapter to other
        fsmFormInstance = new FSMSmartFormsLibrary();
        let actionBinding = libForms.getFormActionBinding(context);
        isClosed = actionBinding.Closed;
        hasCloudID = !ValidationLibrary.evalIsEmpty(GlobalVar.getUserSystemInfo().get('FSM_EMPLOYEE'));
        isEditable = !isClosed && hasCloudID;
        libCom.setStateVariable(context, 'CurrentInstanceID', actionBinding.Id);
        currentChapterIndex = ApplicationSettings.getNumber(context, actionBinding.Id + '_lastChapter', currentChapterIndex); //Get the last chapter visited from storage
        libCom.setStateVariable(context, 'FSMFormInstanceCurrentChapterIndex', currentChapterIndex);

        // Read the main blob that contains all xmls
        const FSMMetaData = await getFSMEntitySet(context).then((blob) => {
            return blob;
        }).catch((err) => {
            Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
        });
        
        // Read the values.xml 
        let valuesFolder = await unZipFormContent(context, actionBinding.Content, actionBinding.Id, 'values')
        .catch((err) => {
            Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
        });
        libCom.setStateVariable(context, 'ChapterValuesFilePath', valuesFolder);

        /*
        * This method takes in the base64 encoding of a Template's content and writes that
        * file (with file name as the Tempalate ID) to a temporary folder.
        */
        let templateFolder = await unZipFormContent(context, FSMMetaData.Content, actionBinding.Id, 'template')
        .catch((err) => {
            Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
        });
        try {
            /* parse container_metadata.xml file */
            let container_metadata_path = fs.path.join(templateFolder, 'container_metadata.xml');
            let container_metadata_file = fs.File.fromPath(container_metadata_path);
            const containerMetadataParser = new xmlModule.XmlParser(fsmFormInstance.parseMetadata, fsmFormInstance.onErrorCallback);
            await container_metadata_file.readText().then(res => {
                containerMetadataParser.parse(res);
            }).catch(err => {
                Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            });
            libCom.setStateVariable(context, 'instanceLanguage', fsmFormInstance.langaugeCode || 'en');

            /* parse translations-en.xml file */
            let translation_path = fs.path.join(templateFolder, FSMSmartFormsLibrary.getLocalizeFileName(context, templateFolder, 'translations'));
            let translation_file = fs.File.fromPath(translation_path);

            /* parse template.xml file */
            const xmlParser = new xmlModule.XmlParser(fsmFormInstance.parseTemplate, fsmFormInstance.onErrorCallback);
            let template_path = fs.path.join(templateFolder, 'template.xml');
            let template_file = fs.File.fromPath(template_path);

            /* parse values.xml file */
            const valuesParser = new xmlModule.XmlParser(fsmFormInstance.parseValues, fsmFormInstance.onErrorCallback);
            let values_path = fs.path.join(valuesFolder, FSMSmartFormsLibrary.getLocalizeFileName(context, valuesFolder, 'values-1'));
            let values_file = fs.File.fromPath(values_path);
            fsmFormInstance.chapters = [];

            
            const translationParser = new xmlModule.XmlParser(fsmFormInstance.parseTranslation, fsmFormInstance.onErrorCallback);
            await translation_file.readText().then(res => {
                translationParser.parse(res);
            }).catch(err => {
                Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            });
            await template_file.readText().then(res => {
                xmlParser.parse(res);
            }).catch(err => {
                Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            });
            await values_file.readText().then(res => {
                valuesParser.parse(res);
            }).catch(err => {
                Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            });
            saveTemplateState(context); // Save template states so we can use it for populating the control
        } catch (err) {
            Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
        }  
    }
         
    /* create a section for chapter picker */
    page.Controls[0].Sections.push({
        '_Type': 'Section.Type.FormCell',
        '_Name': 'SectionChapterPicker',    
        'Controls': [{
            '_Name': 'ChapterListPicker',
            'Caption': '/SAPAssetManager/Rules/Forms/FSM/ChapterPickerCaption.js',
            'Value': '/SAPAssetManager/Rules/Forms/FSM/ChapterPickerValue.js',
            '_Type': 'Control.Type.FormCell.ListPicker',
            'AllowMultipleSelection': false,
            'IsEditable': true,
            'IsPickerDismissedOnSelection': true,
            'PickerItems': '/SAPAssetManager/Rules/Forms/FSM/ChapterPickerItems.js',
            'OnValueChange': '/SAPAssetManager/Rules/Forms/FSM/ChapterPickerOnValueChange.js',
        }],
    });
    fieldsInVisibilityRules = libCom.getStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules');
    let valueMap = libCom.getStateVariable(context, 'FSMFormInstanceControls');

    /* iterate all objects in the chapters array and map the fields of all the chapters to mdk control */
    /* fields of the chapters will be pushed to the Controls array of the Section created below */
    page.Controls[0].Sections.push({
        '_Type': 'Section.Type.FormCell',
        'Controls': [],
    });
 
    for (let d = 0; d < fsmFormInstance.chapters[currentChapterIndex].fields.length; d++) {
        let visibilityRule = '';
        let sigCaption = '';
        let requiredCaption = '';
        const tempField = fsmFormInstance.chapters[currentChapterIndex].fields[d];
        
        if (fieldsInVisibilityRules.hasOwnProperty(tempField.elementID)) { //Does this field exist in any visibility rules?
            visibilityRule = '/SAPAssetManager/Rules/Forms/FSM/FSMFormFieldOnValueChange.js';
        }
        if (tempField.type === 'textinput' && tempField.multiline === 'true') {
            tempField.type = 'note';
        }
        if (tempField.required === 'true') {
            requiredCaption = ' *';
        }
        let sectionsLength = page.Controls[0].Sections.length;
        switch (tempField.type) {
            case 'numberinput': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': tempField.name + requiredCaption,
                    'PlaceHolder': '',
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'Value': valueMap[tempField.elementID].Value,
                    '_Name': tempField.elementID,
                    '_Type': 'Control.Type.FormCell.SimpleProperty',
                    'KeyboardType': 'Number',
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'textinput': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': tempField.name + requiredCaption,
                    'PlaceHolder': '',
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'Value': valueMap[tempField.elementID].Value,
                    '_Name': tempField.elementID,
                    '_Type': 'Control.Type.FormCell.SimpleProperty',
                    'OnValueChange': visibilityRule,
                    'BarcodeScanner': tempField.allowBarcode === 'true',
                    'KeyboardType': 'Default',
                    'IsVisible': true,
                });
                break;
            case 'note': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': '',
                    'Value': tempField.name + requiredCaption,
                    '_Name': tempField.elementID + 'Caption',
                    '_Type': 'Control.Type.FormCell.SimpleProperty',
                    'IsEditable': false,
                });
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': tempField.name + requiredCaption,
                    'PlaceHolder': '',
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'Value': valueMap[tempField.elementID].Value,
                    '_Name': tempField.elementID,
                    '_Type': 'Control.Type.FormCell.Note',
                    'OnValueChange': visibilityRule,
                    'KeyboardType': 'Default',
                    'IsVisible': true,
                    'IsAutoResizing': false,
                });
                break;
            case 'label': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': tempField.name,
                    'PlaceHolder': '',
                    'IsEditable': false,
                    'Value': '',
                    '_Name': tempField.elementID,
                    '_Type': 'Control.Type.FormCell.SimpleProperty',
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'boolinput': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    '_Type': 'Control.Type.FormCell.Switch',
                    '_Name': tempField.elementID,
                    'Caption': tempField.name,
                    'Value': valueMap[tempField.elementID].Value,
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'dropdown': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    '_Type': 'Control.Type.FormCell.ListPicker',
                    '_Name': tempField.elementID,
                    'IsPickerDismissedOnSelection': true,
                    'AllowMultipleSelection': false,
                    'IsSelectedSectionEnabled': true,
                    'AllowEmptySelection': true,
                    'PickerItems': tempField.options,
                    'PickerPrompt': 'Choose option',
                    'Caption': tempField.name + requiredCaption,
                    'Value': valueMap[tempField.elementID].Value,
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'FilterProperty': 'Priority',
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'dateinput': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    '_Type': 'Control.Type.FormCell.DatePicker',
                    '_Name': tempField.elementID,
                    'Caption': tempField.name + requiredCaption,
                    'Value': valueMap[tempField.elementID].Value,
                    'Mode': tempField.coreType,
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'attachment': 
            if (!ValidationLibrary.evalIsEmpty(valueMap[tempField.elementID].Value) && libForms.isValidUUID(valueMap[tempField.elementID].Value)) {
                libForms.getMediaControl(page, valueMap, tempField);
            }
            break;
            case 'signature':
                sigCaption = '$(L, add_signature)';
                if (!ValidationLibrary.evalIsEmpty(valueMap[tempField.elementID].Value) && libForms.isValidUUID(valueMap[tempField.elementID].Value)) {
                    libForms.getMediaControl(page, valueMap, tempField);
                    sectionsLength = page.Controls[0].Sections.length;
                    sigCaption = '$(L, forms_replace_signature)';
                }
            
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    '_Type': 'Control.Type.FormCell.InlineSignatureCapture',
                    '_Name': tempField.elementID,
                    'Caption': sigCaption + requiredCaption,
                    'ShowTimestampInImage': true,
                    'ShowXMark': true,
                    'ShowUnderline': true,
                    'TimestampFormatter': 'MM/dd/yy hh:mm a zzz',
                    'HelperText': tempField.name,
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                });
                break;
            case 'stateElement': 
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    '_Type': 'Control.Type.FormCell.ListPicker',
                    '_Name': tempField.elementID + '.value',
                    'AllowMultipleSelection': false,
                    'AllowEmptySelection': true,
                    'PickerItems': libForms.getStatusForMachines(),
                    'PickerPrompt': 'Choose option',
                    'Caption': tempField.name + requiredCaption,
                    'Value': ValidationLibrary.evalIsNumeric(valueMap[tempField.elementID].Value.Value) ? libForms.getStatusForMachines()[valueMap[tempField.elementID].Value.Value]: '',
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                    'IsPickerDismissedOnSelection': true,
                });
                page.Controls[0].Sections[sectionsLength - 1].Controls.push({
                    'Caption': 'Comment' + requiredCaption,
                    'Value': valueMap[tempField.elementID].Value.Comment,
                    '_Name': tempField.elementID + '.comment',
                    '_Type': 'Control.Type.FormCell.SimpleProperty',
                    'OnValueChange': visibilityRule,
                    'IsVisible': true,
                    'IsEditable': isEditable && (tempField.readOnly === 'false' || !tempField.readOnly),
                });
                break;
            default:
                Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), 'Unknown control type: ' + tempField.type + ' name ' + tempField.name + ' elementId: ' + tempField.elementID);
                break;
        }
    }
    
    let actionBinding = libForms.getFormActionBinding(context);
    context.getPageProxy().setActionBinding(actionBinding);

    /* Open the Empty page with the above controls */
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Forms/NavFormPage.action',
        'Properties': {
            'PageMetadata': page,
            'PageToOpen': '/SAPAssetManager/Pages/Forms/Empty.page',
            'ClearHistory': true,
            'Transition': {
                'Name': 'None',
            },
        },
        'Type': 'Action.Type.Navigation',
    });
}

/*
* Method to get the FSM TemplateEnitity set and returns the Template Entity
*/
function getFSMEntitySet(context) {

    var idClause = '';
    let actionBinding = libForms.getFormActionBinding(context);
    if (!ValidationLibrary.evalIsEmpty(actionBinding) && !ValidationLibrary.evalIsEmpty(actionBinding.Template)) {
        idClause = `('${actionBinding.Template}')`; 
        return context.read('/SAPAssetManager/Services/AssetManager.service', `FSMFormTemplates${idClause}`, [], '').then(result => {
            if (result && result.getItem(0)) {
                return result.getItem(0);
            }
            return '';
        });
    }
    return '';
}

/*
* This method takes in a base64 encoding of a zip file, as well as the
* name of the new zipped file and writes thta to a temporary file.
* This portion was written with Mac and for IOS.
*/
function unZipFormContent(context, encodedContent, instanceId, idenfier ) {
    const zippedContent = base64Decode(context, encodedContent);
    const fileName = idenfier + '-' + instanceId;
    const fileExtension = '.zip';
    const fullFileName = fileName + fileExtension;
    const zipPath = fs.path.join(fs.knownFolders.temp().path, fullFileName);
    const zipFile = fs.File.fromPath(zipPath);

    return zipFile.write(zippedContent).then(() => {
        const zipSource = zipPath;
        const zipDest =  fs.path.join(fs.knownFolders.temp().path, fileName);
        // create the folder
        const zipFolder = fs.Folder.fromPath(zipDest);
        return zipFolder.clear().then(() => {
            unzip(context, zipSource, zipDest);    
            return zipDest;
        });
    });
}

function base64Decode(context, encodedContent) {
    var zippedContent = null;

    if (IsAndroid(context)) {
        // eslint-disable-next-line no-undef
        zippedContent = android.util.Base64.decode(encodedContent,android.util.Base64.DEFAULT);
    } else {
        // eslint-disable-next-line no-undef
        zippedContent = NSData.alloc().initWithBase64EncodedStringOptions(encodedContent, 0);
    }
    
    return zippedContent;
}

/**
 * Persist data for this instance/template after parsing XML
 * Data is used to process visibility rules based on data entry, validation, saving back to XML, etc...
 * @param {*} context 
 */
function saveTemplateState(context) {
    let chapterArray = []; //Keep track of all chapters and their visibility state
    let fields = {};
    let ext = -1;
    const validControlTypes = libForms.getSupportedSmartformControls();
    fieldsInVisibilityRules = {};

    try {
        ApplicationSettings.setBoolean(context, 'XMLTemplateParsed', true);
        for (let i = 0; i < fsmFormInstance.chapters.length; i++) {
            let chapterObject = {};
            chapterObject.id = fsmFormInstance.chapters[i].elementID;
            chapterObject.name = fsmFormInstance.chapters[i].chapterName;
            chapterObject.index = i;
            chapterObject.isVisible = true;
            chapterObject.isSubChapter = fsmFormInstance.chapters[i].isSubChapter;
            chapterObject.state = 0;
            chapterObject.oldState = 0;
            if (!chapterObject.isSubChapter) {
                ext++;
                chapterObject.extensionIndex = ext;
            }
            chapterArray.push(chapterObject);
            for (let d = 0; d < fsmFormInstance.chapters[i].fields.length; d++) { //Track all fields and their current values
                let control = {};
                let value;
                let tempField = fsmFormInstance.chapters[i].fields[d];
                let tempOption = '';
                let selectedIndex;

                if (!validControlTypes[tempField.type]) {
                    continue; //Only process supported control types
                }

                control.Name = tempField.elementID;
                control.Type = tempField.type;
                control.NeedsXMLUpdate = false;
                control.Required = tempField.required === 'true';
                control.Min = tempField.min;
                control.Max = tempField.max;
                control.AllowOutOfRangeValues = tempField.allowOutOfRangeValues === 'true';
                control.MinDecimals = tempField.minDecimals;
                control.MaxDecimals = tempField.maxDecimals;
                control.ChapterIndex = chapterObject.index;
                control.Chapter = chapterObject;
                control.IsVisible = true;

                switch (control.Type) {
                    case 'numberinput':
                        value = fsmFormInstance.userValues.has(tempField.elementID) ? Number(fsmFormInstance.userValues.get(tempField.elementID)) : tempField.value;
                        break;
                    case 'textinput':
                    case 'note':
                    case 'dateinput':
                    case 'signature':
                        value = fsmFormInstance.userValues.has(tempField.elementID) ? fsmFormInstance.userValues.get(tempField.elementID) : tempField.value;
                        control.FileContent = '';
                        break;
                    case 'attachment':
                        control.attachmentName = tempField.attachmentName;
                        value = tempField.attachmentID;
                        break;
                    case 'label':
                        value = tempField.name;
                        break;
                    case 'boolinput':
                        value = fsmFormInstance.userValues.has(tempField.elementID) ? 'true' === fsmFormInstance.userValues.get(tempField.elementID) : tempField.value === 'true';
                        break;
                    case 'dropdown': //Smartforms use the selectedindex of the picker option as the stored value
                        selectedIndex = tempField.selectedIndex;
                        if (ValidationLibrary.evalIsNumeric(selectedIndex)) {
                            selectedIndex = Number(selectedIndex);
                            if (selectedIndex > -1) {
                                let option = tempField.options[tempField.options.findIndex((row) => row.Index === selectedIndex)];
                                if (option) {
                                    tempOption = option;
                                }
                            }
                        }
                        if (fsmFormInstance.userValues.has(tempField.elementID)) {
                            if (ValidationLibrary.evalIsNumeric(fsmFormInstance.userValues.get(tempField.elementID))) {
                                value = tempField.options[Number(fsmFormInstance.userValues.get(tempField.elementID))].ReturnValue;
                            } else {
                                value = '';
                            }
                        } else {
                            value = tempOption.ReturnValue;
                        }
                        control.Options = {};
                        for (let j=0; j < tempField.options.length; j++) { //Save these options for visibility checks
                            control.Options[tempField.options[j].ReturnValue] = tempField.options[j];
                        }
                        break;
                    case 'stateElement':
                        value = {
                            'Value': fsmFormInstance.userValues.has(tempField.elementID + 'value') ? fsmFormInstance.userValues.get(tempField.elementID + 'value') : tempField.selectedIndex,
                            'Comment': fsmFormInstance.userValues.has(tempField.elementID + 'comment') ? fsmFormInstance.userValues.get(tempField.elementID + 'comment') : tempField.value,
                        };
                        // By default all control have @localized value and if there is no corresponding
                        // section for them in values.xml or translations.xml, we show empty
                        value.Value = value.Value === '@localized' ? '' : value.Value;
                        if (ValidationLibrary.evalIsNumeric(value.Value)) {
                            value.Value = Number(value.Value);
                        }
                        value.Comment = value.Comment === '@localized' ? '' : value.Comment;
                        break;
                    default:
                        break;
                }
                control.Value = value === '@localized' ? '' : value;
                fields[control.Name] = control;
                saveElementsInRules(control.Name);
            }
        }
        libCom.setStateVariable(context, 'FSMFormInstanceControls', fields);
        libCom.setStateVariable(context, 'FSMFormInstanceVisibilityRules', fsmFormInstance.visibilityRules);
        libCom.setStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules', fieldsInVisibilityRules);
        libForms.SetInitialChapterAndFieldVisibilityState(context, chapterArray); //Run visibility rules so the page has chapter visibility for extension and chapter picker
        libCom.setStateVariable(context, 'FSMFormInstanceChapters', chapterArray);
    } catch (err) {
        Logger.error(context.getPageProxy().getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
    }
}

/**
 * Save field names that are needed for rules
 * @param {*} context 
 */
function saveElementsInRules(fieldName) {
    const pattern = new RegExp('\\b(' + fieldName + ')\\b', 'i'); //ig

    for (const control in fsmFormInstance.visibilityRules) { //Loop over all visibility rules
        if (fieldsInVisibilityRules.hasOwnProperty(fieldName)) { //Already found this field in a rule
            break;
        }
        if (fsmFormInstance.visibilityRules[control].Rule.match(pattern)) {  //Does this field exist in visibilty rule criteria?
            fieldsInVisibilityRules[fieldName] = true;
        }
    }
}
