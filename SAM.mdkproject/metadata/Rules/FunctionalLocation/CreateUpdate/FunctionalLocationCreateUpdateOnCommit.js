import libCommon from '../../Common/Library/CommonLibrary';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../FunctionalLocationLibrary';
import DocLib from '../../Documents/DocumentLibrary';

export default function FunctionalLocationCreateUpdateOnCommit(context) {
    let onCreate = libCommon.IsOnCreate(context);

    if (onCreate) {
        return _createFLOC(context);
    }

    return _updateFLOC(context);
}

function _createFLOC(context) {
    return libFLOC.validateValues(context, true)
        .then(function(flocId) {
            context.getClientData().LocalID = flocId;
            libCommon.setStateVariable(context, 'LocalId', flocId);

            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreate.action')
                .then(response => {
                    libCommon.setStateVariable(context, 'CreateFunctionalLocation', JSON.parse(response.data));
                    let createdFLOCLink = JSON.parse(response.data)['@odata.readLink'];
                    context.getClientData().LocalLink = createdFLOCLink;
                    return _createNote(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                    }).catch(() => {
                        return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                    });
                }).catch(()=>{
                    context.getClientData().LocalID = '';
                    libCommon.setStateVariable(context, 'LocalId', '');
                    return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                });
        })
        .catch((error) => {
            const idControl = libCommon.getControlProxy(context, 'IdProperty');
            const mask = libCommon.getStateVariable(context, 'EditMask');
            libCommon.setInlineControlError(context, idControl, context.localizeText(error, [mask]));
            idControl.applyValidation();
            context.getClientData().LocalID = '';
            libCommon.setStateVariable(context, 'LocalId', '');
            return Promise.reject();
        });
}

function _createNote(context) {
    return _createDocuments(context).then(() => {
        let note = libCommon.getControlProxy(context, 'LongTextNote').getValue();
        if (note) {
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/NoteCreate.action');
        } else {
            return Promise.resolve();
        }
    });
}

function _createDocuments(context) {
    // attachments
    let attachmentDescription = context.getPageProxy().getControl('FormCellContainer').getControl('AttachmentDescription').getValue() || '';
    let attachments = context.getPageProxy().getControl('FormCellContainer').getControl('Attachment').getClientData().AddedAttachments;

    libCommon.setStateVariable(context, 'DocDescription', attachmentDescription);
    libCommon.setStateVariable(context, 'Doc', attachments);
    libCommon.setStateVariable(context, 'Class', 'FunctionalLocation');
    libCommon.setStateVariable(context, 'ObjectKey', 'FuncLocIdIntern');
    libCommon.setStateVariable(context, 'entitySet', 'MyFuncLocDocuments');
    libCommon.setStateVariable(context, 'parentProperty', 'FunctionalLocation');
    libCommon.setStateVariable(context, 'parentEntitySet', 'MyFunctionalLocations');
    libCommon.setStateVariable(context, 'attachmentCount', DocLib.validationAttachmentCount(context));

    return Promise.resolve();
}

function _updateFLOC(context) {
    return libFLOC.validateValues(context, false)
        .then((flocId)=>{
            context.binding.LocalID = flocId;
            libCommon.setStateVariable(context, 'LocalId', flocId);

            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationUpdate.action');
        })
        .catch((error) => {
            const idControl = libCommon.getControlProxy(context, 'IdProperty');
            libCommon.setInlineControlError(context, idControl, context.localizeText(error, [context.binding.EditMask]));
            idControl.applyValidation();
            context.binding.LocalID = '';
            libCommon.setStateVariable(context, 'LocalId', '');
            return Promise.reject();
        });
}
