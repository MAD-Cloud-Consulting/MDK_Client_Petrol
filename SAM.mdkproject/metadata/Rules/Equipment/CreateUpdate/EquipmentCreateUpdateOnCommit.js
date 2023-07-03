import libCommon from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import DocLib from '../../Documents/DocumentLibrary';

export default function EquipmentCreateUpdateOnCommit(context) {
    context.showActivityIndicator('');

    let onCreate = libCommon.IsOnCreate(context);

    if (onCreate) {
        return _createEquip(context);
    }

    return _updateEquip(context);
}

function _createEquip(context) {
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreate.action')
        .then(response => {
            libCommon.setStateVariable(context, 'CreateEquipment', JSON.parse(response.data));
            let createdEquipLink = JSON.parse(response.data)['@odata.readLink'];
            if (ValidationLibrary.evalIsEmpty(context.binding)) {
                context._context.binding = {};
            }
            context.binding.LocalLink = createdEquipLink;
            return _createNote(context).then(() => {
                context.dismissActivityIndicator();
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
            });
        }).catch(()=>{
            context.dismissActivityIndicator();
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
        });
}

function _createNote(context) {
    return _createDocuments(context).then(() => {
        let note = libCommon.getControlProxy(context, 'LongTextNote').getValue();
        if (note) {
            return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/NoteCreate.action');
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
    libCommon.setStateVariable(context, 'Class', 'Equipment');
    libCommon.setStateVariable(context, 'ObjectKey', 'EquipId');
    libCommon.setStateVariable(context, 'entitySet', 'MyEquipDocuments');
    libCommon.setStateVariable(context, 'parentProperty', 'Equipment');
    libCommon.setStateVariable(context, 'parentEntitySet', 'MyEquipments');
    libCommon.setStateVariable(context, 'attachmentCount', DocLib.validationAttachmentCount(context));

    return Promise.resolve();
}


function _updateEquip(context) {
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentUpdate.action')
        .then(() => {
            return _createDocuments(context).then(() => {
                context.dismissActivityIndicator();
            });
        }).catch(() => {
            context.dismissActivityIndicator();
        });
}
