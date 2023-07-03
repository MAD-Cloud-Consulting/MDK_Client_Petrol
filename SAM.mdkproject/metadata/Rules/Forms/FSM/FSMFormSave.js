import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import FSMSmartFormsLibrary from './FSMSmartFormsLibrary';
import * as fs from '@nativescript/core/file-system';
import { zip } from '../ZipUtil';
import Base64Library from '../../Common/Library/Base64Library';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import IsAndroid from '../../Common/IsAndroid';
import libForms from './FSMSmartFormsLibrary';
import saveLastChapterVisitedToStorage from './SaveLastChapterVisitedToStorage';

/**
* Save the form into a values.xml file
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSave(clientAPI) {
    const context = clientAPI.getPageProxy();
    const isClosePage = (CommonLibrary.getStateVariable(context, 'FSMToastMessage') === context.localizeText('forms_saved_toast'));
    const isSubmit = (CommonLibrary.getStateVariable(context, 'FSMToastMessage') === context.localizeText('forms_closed_toast'));
    const isDraft = (CommonLibrary.getStateVariable(context, 'FSMToastMessage') === context.localizeText('forms_draft_toast'));
    
    if (context.binding.Closed) return Promise.resolve(); //Form is already submitted

    return FSMSmartFormsLibrary.saveCurrentPageValues(context).then(() => {
        let actionBindingObject = FSMSmartFormsLibrary.getFormActionBinding(context);
        let valuesFolderPath = CommonLibrary.getStateVariable(context, 'ChapterValuesFilePath');
        let formControls = CommonLibrary.getStateVariable(context, 'FSMFormInstanceControls');
        let signatureMap = {};
    
        if (!ValidationLibrary.evalIsEmpty(valuesFolderPath)) {
            var formNameValueMap = new Map(); // create a map of key value pair
            for (const control in formControls) {
                if (formControls[control].NeedsXMLUpdate) { // only add the control that needs update
                    switch (formControls[control].Type) {
                        case 'stateElement':
                            formNameValueMap.set(control + '.value', (formControls[control].Value.Value));
                            formNameValueMap.set(control + '.comment', formControls[control].Value.Comment);
                            break;
                        case 'dropdown':
                            var indexForPicker = FSMSmartFormsLibrary.getValueFromElement(context, formControls[control].Name, formControls);
                            formNameValueMap.set(control, indexForPicker);
                            break;
                        case 'dateinput':
                            formNameValueMap.set(control, formControls[control].Value);
                            break;
                        case 'numberinput':
                            formNameValueMap.set(control, Number(formControls[control].Value));
                            break;
                        case 'signature': //Track the local signatures for removal later if necessary
                            formNameValueMap.set(control, formControls[control].Value);
                            signatureMap[control] = formControls[control].Value;
                            break;
                        default:
                            formNameValueMap.set(control, formControls[control].Value);
                            break;
                    }
                }        
            }
            if (formNameValueMap.size || isSubmit) { //Either save is required because of change, or user is submitting form
                if (isClosePage) { //See if user wants to exit without saving
                    return CommonLibrary.showWarningDialog(context, context.localizeText('confirm_cancel'), context.localizeText('warning'), context.localizeText('continue_text'), context.localizeText('cancel')).then((result) => {
                        if (result === true) {
                            CommonLibrary.removeStateVariable(context, 'FSMToastMessage');
                            return CancelSaveCleanup(signatureMap); //Remove local signatures
                        } else {
                            CommonLibrary.setStateVariable(context, 'FSMToastMessage', 'CANCELCLOSE');
                            return Promise.resolve();
                        }
                    });
                }
                for (const control in formControls) { //We are saving changes at this point, so first reset needsXMLUpdate on changed controls
                    if (formControls[control].NeedsXMLUpdate) {
                        formControls[control].NeedsXMLUpdate = false;
                    }
                }
                let currentIndex = CommonLibrary.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
                saveLastChapterVisitedToStorage(context, currentIndex);

                let values_path = fs.path.join(valuesFolderPath, FSMSmartFormsLibrary.getLocalizeFileName(context, valuesFolderPath, 'values-1'));
                let values_file = fs.File.fromPath(values_path);
                //editing values.xml file to include new values
                return values_file.readText().then(res => {
                    if (res.length <= 0) { // it's an empty file so add header
                        res = '<?xml version="1.0" encoding="UTF-8"?>' + '\n' + '<values>' + '\n' + '\t';
                    }
                    for (const control of formNameValueMap.keys()) { // will only have values that needs update
                        //finding the position of control id
                        let key = control.includes('stateElement') ? control.split('.')[0] : control;
                        let controlName = formControls[key].Chapter.id + '.' + control;
                        var index = res.indexOf(controlName);
                        var indexOfValues = res.indexOf('</values>');
                        if (index !== -1) { // Make sure we only add when the index is found
                            //finding the position of value for the control
                            var endElementIndex = res.indexOf('>', index);
                            var startElementIndex = res.indexOf('<', index);
                            res = res.substring(0,endElementIndex+1) + formNameValueMap.get(control) + res.substring(startElementIndex, res.length);
                        } else {
                            let xml = FSMSmartFormsLibrary.createXMLString(control, formControls, formNameValueMap);
                            res = res.slice(0, indexOfValues - 1) + '\n\t' + xml + '\n' + '</values>';
                        } 
                    }
                    return values_file.writeText(res).then(function() {
                        // create the modified zip folder
                        const valuesZipFile = fs.File.fromPath(valuesFolderPath + '.zip');
                        return valuesZipFile.remove().then(() => {
                            let dest = valuesZipFile.path; 
                            zip(context, valuesFolderPath, dest);
                            let documentFile = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(dest);
                            let binarySource = documentFile.readSync(error => {
                                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${error}`);
                            });
                            if (binarySource) {
                                let base64String = Base64Library.transformBinaryToBase64(IsAndroid(context), binarySource);
                                actionBindingObject.base64String = base64String;
                                clientAPI.getPageProxy().setActionBinding(actionBindingObject);
                                return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/UpdateFormInstance.action').then(() => {
                                    if (isDraft) { //User is saving draft, so show toast
                                        return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                                            CommonLibrary.removeStateVariable(context, 'FSMToastMessage');
                                            return Promise.resolve();
                                        });
                                    }
                                    return Promise.resolve();
                                });
                            }
                            return Promise.resolve();
                        }).catch((error) => {
                                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${error}`);
                                return Promise.reject();
                        });
                    });
                });
            } else { //Nothing has changed, so save is skipped
                if (isClosePage) { //User is closing the form, but nothing has changed, so supress save toast message
                    CommonLibrary.removeStateVariable(context, 'FSMToastMessage');
                }
                if (isDraft) { //Display the no save required message
                    CommonLibrary.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_nodraft_toast'));
                    return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                        CommonLibrary.removeStateVariable(context, 'FSMToastMessage');
                        return Promise.resolve();
                    });
                }
            }
        }
        return Promise.resolve();
    });

    /**
     * User cancels a form save, so cleanup signatures, etc...
     * @param {*} context 
     * @param {*} caption 
     * @returns 
     */
    function CancelSaveCleanup(sigMap) {
        let promises = [];

        for (const control in sigMap) {
            if (libForms.ifMediaExist(sigMap[control])) { //Remove local signature image
                promises.push(libForms.deleteLocalMedia(sigMap[control]));
            }
            let filter = "$filter=DocumentId eq '" + sigMap[control] + "'";
            promises.push(context.executeAction({ //Remove signature from db
                'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMAttachmentDelete.action', 'Properties': {
                'Target': {
                    'EntitySet' : 'FSMFormAttachments',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions' : filter,
                },
            }}));
        }
        return Promise.all(promises).catch((err) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Forms/FSM/FSMForm.global').getValue(), `Error: ${err.message}`);
            context.getClientData().Error=context.localizeText('update_failed');
            context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
        });
    }

}
