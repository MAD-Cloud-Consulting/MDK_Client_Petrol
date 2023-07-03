import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import ConstantsLibrary from '../Common/Library/ConstantsLibrary';
import Logger from '../Log/Logger';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export class NoteLibrary {

    /**
     * Prepend a new note to existing note. If new text is empty, it returns back existing text
     * @param {IClientAPI} existingText
     * @param {string} newText
     */
    static prependNoteText(existingText, newText) {
        if (!libVal.evalIsEmpty(newText)) {
            let appendedText = newText + '\n\n' + existingText;
            return appendedText.trim();
        }
        return existingText;
    }

    /**
     * Triggered when the page is loaded
     * If a note exists then, display it in the text field
     * @param {*} pageClientAPI
     */
    static createUpdateOnPageLoad(pageClientAPI) {

        let noteTitle;
        //Determine if we are on edit vs. create in order to set the caption
        let onCreate = libCommon.IsOnCreate(pageClientAPI);
        // Set this title if we are adding note after rejection an operation
        let isOnRejectOp = libCommon.getStateVariable(pageClientAPI, 'IsOnRejectOperation');

        if (isOnRejectOp) {
            noteTitle = pageClientAPI.localizeText('reject_reason');
        } else if (onCreate) {
            noteTitle = pageClientAPI.localizeText('add_note');
        } else {
            noteTitle = pageClientAPI.localizeText('edit_note');
        }

        pageClientAPI.setCaption(noteTitle);
    }

    /**
     * Get note page caption
     * @param {*} pageClientAPI
     */
    static getCaption(pageClientAPI) {
        let caption = '';
        //Determine if we are on edit vs. create in order to set the caption
        let onCreate = libCommon.IsOnCreate(pageClientAPI);
        // Set this title if we are adding note after rejection an operation
        let isOnRejectOp = libCommon.getStateVariable(pageClientAPI, 'IsOnRejectOperation');

        if (isOnRejectOp) {
            caption = pageClientAPI.localizeText('reject_reason');
        } else if (onCreate) {
            caption = pageClientAPI.localizeText('add_note');
        } else {
            caption = pageClientAPI.localizeText('edit_note');
        }
        
        return caption;
    }

    /**
     * Download existing note
     * @param {*} pageClientAPI
     */
    static noteDownload(pageClientAPI, completionEntitySet) {
        let note;
        //clear the existing variable
        libCommon.setStateVariable(pageClientAPI, ConstantsLibrary.noteStateVariable, '');
        let entitySet = completionEntitySet || this.buildEntitySet(pageClientAPI);
        let filter = this.getFilter(pageClientAPI); //further filtering is needed for some note types

        //Read the existing note
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
            if (!libVal.evalIsEmpty(result)) {
                //Grab the first row
                note = result.getItem(0);
                libCommon.setStateVariable(pageClientAPI, ConstantsLibrary.noteStateVariable, note);
                return note;
            }
            return null;
        });
    }

    /**
     * Process the downloaded note, converting any time stamps to local time
     * and format to local time format for display
     * Timestapms are of the form 'YYYY-MM-DD HH:MM:SS XXX' where XXX is the timezone
     * Convert to YYYY-MM-DDTHH:MM:SS for Date object.  Subtract offset to account
     * for backend offset from GMT.
     * @param {*} pageClientAPI
     */
    static noteDownloadValue(pageClientAPI) {
        return this.noteDownload(pageClientAPI).then(note => {
            if (note && note.TextString) {
                return note.TextString.replace(/\d{4}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d [A-Z]{3}/g, function(match) {
                    let dateStr = match.substr(0, match.length-4).replace(' ', 'T');
                    let date = new OffsetODataDate(pageClientAPI, dateStr);
                    return pageClientAPI.formatDatetime(date.date());
                });
            }
            return '-';
        });
    }

    /**
     * Build entity set depending on whether it's coming from the Error Archive or not
     * @param {*} pageClientAPI
     */
    static buildEntitySet(pageClientAPI) {
        let odataId = pageClientAPI.evaluateTargetPath('#Property:@odata.id');
        
        if (pageClientAPI.evaluateTargetPath('#Property:@odata.type') === '#sap_mobile.MeasuringPoint') {
            odataId = pageClientAPI.binding.WorkOrderTool[0]['@odata.id'];
        }  
        let transactionTypeObject = libCommon.getStateVariable(pageClientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);
        
        // FromErrorArchive may be undefined on previous page's client data. evaluateTargetPath will throw an exception.
        try {
            let isFromErrorArchive = pageClientAPI.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:FromErrorArchive');
            return odataId + (isFromErrorArchive? '' : '/' + transactionTypeObject.component);
        } catch (exc) {
            return odataId + '/' + transactionTypeObject.component;
        }
    }

    /**
     * Get OData filter for this note type
     * @param {*} pageClientAPI
     */
     static getFilter(pageClientAPI) {
        let filter = '';
        let transactionTypeObject = libCommon.getStateVariable(pageClientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);
        if (transactionTypeObject.filter) {
            filter = transactionTypeObject.filter;
        }
        return filter;
    }

    /**
     * set the noteType state variable
     * @param {IClientAPI} clientAPI
     * @param {string} noteType
     */
    static setNoteTypeTransactionFlag(clientAPI, noteType) {
        if (noteType) {
            libCommon.setStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable, noteType);
        } else {
            //empty
            libCommon.setStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable, '');
        }
    }


    static didSetNoteTypeTransactionForBindingType(clientAPI) {
        let page = clientAPI.getPageProxy()._page._definition.getName();
        if (page === 'MeasuringPointDetailsPage') {
            clientAPI._context.binding = clientAPI.getPageProxy().binding.WorkOrderTool[0];
        }
        let binding = libCommon.getBindingObject(clientAPI);
        let bindingType = binding['@odata.type'];

        if (!bindingType) {
            return false;
        }

        let startIndex = bindingType.lastIndexOf('.') + 1;

        switch (bindingType.substr(startIndex)) {
            case 'MyWorkOrderTool': 
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.prt(page));
                break;
            case 'MyWorkOrderHeader':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrder());
                break;
            case 'MyWorkOrderOperation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderOperation());
                break;
            case 'MyWorkOrderSubOperation':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderSubOperation());
                break;
            case 'MyNotificationHeader':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notification());
                break;
            case 'MyNotificationTask':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationTask());
                break;
            case 'MyNotificationActivity':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationActivity());
                break;
            case 'MyNotificationItem':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItem());
                break;
            case 'MyNotificationItemTask':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemTask());
                break;
            case 'MyNotificationItemActivity':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemActivity());
                break;
            case 'MyNotificationItemCause':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemCause());
                break;
            case 'MyWorkOrderComponent':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.part());
                break;
            default:
                // Didn't set the transaction type
                return false;
        }

        return true;
    }

    /**
     * Helper method for setting Note Type Transaction Flag based on page name
     * @param {*} clientAPI
     * @param {*} page
     */
    static  didSetNoteTypeTransactionFlagForPage(clientAPI, page) {
        switch (page) {
            case 'MeasuringPointDetailsPage':
            case 'PRTMaterialDetailsPage':
            case 'PRTEquipmentDetailsPage':
            case 'PRTMiscellaneousDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.prt(page));
                break;
            case 'WorkOrderDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrder());
                break;
            case 'WorkOrderOperationDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderOperation());
                break;
            case 'SubOperationDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.workOrderSubOperation());
                break;
            case 'NotificationDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notification());
                break;
            case 'NotificationTaskDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationTask());
                break;
            case 'NotificationActivityDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationActivity());
                break;
            case 'NotificationItemDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItem());
                break;
            case 'NotificationItemTaskDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemTask());
                break;
            case 'NotificationItemActivityDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemActivity());
                break;
            case 'NotificationItemCauseDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.notificationItemCause());
                break;
            case 'PartDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.part());
                break;
            case 'FunctionalLocationDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.funcloc());
                break;
            case 'EquipmentDetailsPage':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.equipment());
                break;
            case 'PurchaseOrderDetails':
                this.setNoteTypeTransactionFlag(clientAPI, TransactionNoteType.purchaseOrder(clientAPI));
                break;
            default:
                // Didn't set the transaction type
                return false;
        }
        return true;
    }

    /**
     * get the noteType state variable
     * @param {IClientAPI} clientAPI
     */
    static getNoteTypeTransactionFlag(clientAPI) {
        const noteTypeTransactionFlag = libCommon.getStateVariable(clientAPI, ConstantsLibrary.transactionNoteTypeStateVariable);

        try {
            if (clientAPI.evaluateTargetPath('#Property:@odata.type') === '#sap_mobile.MeasuringPoint') {
                clientAPI._context.binding = clientAPI.getPageProxy().binding.WorkOrderTool[0];
            }

            return noteTypeTransactionFlag;
        } catch (e) {
            return noteTypeTransactionFlag;
        }
    }

    /**
     * Get the note component for a given page
     * @param {*} clientAPI
     * @param {*} page
     */
    static getNoteComponentForPage(clientAPI, page) {
        if (this.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
            return this.getNoteTypeTransactionFlag(clientAPI).component;
        }
        return '';
    }

    /**
     * Creates the link between the Long text entity set with the parent entity set.
     * @param {*} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static createLinks(context) {
        var createLinks = [];
        let onChangeSet = libCommon.isOnChangeset(context);
        let objectType = this.getNoteTypeTransactionFlag(context);
        

        if (onChangeSet) {
            // On the Workorder Create or similar changeset
            let currentCounter = libCommon.getCurrentChangeSetActionCounter(context);
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', 'pending_' + currentCounter);
            createLinks.push(noteCreateLink.getSpecifier());
        } else if (libCommon.getStateVariable(context, 'contextMenuSwipePage')) {
            let bindingObj = libCommon.getBindingObject(context);
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', bindingObj['@odata.readLink']);
            createLinks.push(noteCreateLink.getSpecifier());
        } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            //We are creating a new note for a new notification by recording a defect from EAM Checklist.
            //The new notification has previously been saved in the 'CreateNotification' state variable. 
             let notifObj = libCommon.getStateVariable(context, 'CreateNotification');
             if (libCommon.isDefined(notifObj['@odata.readLink'])) {
                //Adding a note after the business object is created
                let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', notifObj['@odata.readLink']);
                createLinks.push(noteCreateLink.getSpecifier());
             }
        } else {    
            //Adding a note after the business object is created
            let readLink = '';
            if (objectType.page === 'MeasuringPointDetailsPage') {
                readLink = context.evaluateTargetPath('#Page:-Previous/#Property:@odata.readLink');
            } else {
                readLink = context.evaluateTargetPath('#Page:' + objectType.page + '/#Property:@odata.readLink');
            }
            let noteCreateLink = context.createLinkSpecifierProxy(objectType.name, objectType.entitySet, '', readLink);
            createLinks.push(noteCreateLink.getSpecifier());
        }

        return createLinks;
    }

    /**
     * Gets the correct entity set from the saved state variable
     * @param {*} context Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static getEntitySet(context) {
        return this.getNoteTypeTransactionFlag(context).longTextEntitySet;
    }

    /**
     * Refresh the parent details page and run toast message after note save
     * @param {*} proxyAPI Could be SectionProxy, PageProxy, ControlProxy, etc.
     */
    static createSuccessMessage(proxyAPI) {
        try {
            let objectType = this.getNoteTypeTransactionFlag(proxyAPI);
            let pageProxy = proxyAPI.evaluateTargetPathForAPI('#Page:' + objectType.page);
            let controls = pageProxy.getControls();
            for (let control of controls) {
                control.redraw();
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(proxyAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotes.global').getValue(), 'Note createSuccessMessage Error: ' + err);
        }
        ExecuteActionWithAutoSync(proxyAPI, '/SAPAssetManager/Actions/Notes/NoteCreateSuccessMessage.action');
    }
}

/**
 * This class stores all of the possible Note Types.
 * When referencing a note type, please use the following class.
 */
export class TransactionNoteType {
    static workOrder() {
        return {
            component: 'HeaderLongText',
            name: 'WorkOrderHeader',
            entitySet: 'MyWorkOrderHeaders',
            longTextEntitySet: 'MyWorkOrderHeaderLongTexts',
            page: 'WorkOrderDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWO.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWO.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWO.action',
        };
    }

    static prt(page) {
        return {
            component: 'WOToolLongText_Nav',
            name: 'WOTool_Nav',
            entitySet: 'MyWorkOrderTools',
            longTextEntitySet: 'MyWorkOrderToolLongTexts',
            page: page,
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnPRT.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnPRT.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnPRT.action',
        };
    }

    static workOrderOperation() {
        return {
            component: 'OperationLongText',
            name: 'WorkOrderOperation',
            entitySet: 'MyWorkOrderOperations',
            longTextEntitySet: 'MyWorkOrderOperationLongTexts',
            page: 'WorkOrderOperationDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOOperation.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOOperation.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWOOperation.action',
        };
    }

    static workOrderSubOperation() {
        return {
            component: 'SubOperationLongText',
            name: 'WorkOrderSubOperation',
            entitySet: 'MyWorkOrderSubOperations',
            longTextEntitySet: 'MyWorkOrderSubOpLongTexts',
            page: 'SubOperationDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOSubOperation.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnWOSubOperation.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnWOSubOperation.action',
        };
    }

    static part() {
        return {
            component: 'ComponentLongText',
            name: 'WorkOrderComponent',
            entitySet: 'MyWorkOrderComponents',
            longTextEntitySet: 'MyWorkOrderComponentLongTexts',
            page: 'PartDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Create/NotesCreateOnParts.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotesUpdateOnParts.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotesDeleteOnParts.action',

        };
    }

    static notification() {
        return {
            component: 'HeaderLongText',
            name: 'Notification',
            entitySet: 'MyNotificationHeaders',
            longTextEntitySet: 'MyNotifHeaderLongTexts',
            page: 'NotificationDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationNoteDelete.action',

        };
    }

    static notificationItem() {
        return {
            component: 'ItemLongText',
            name: 'NotificationItem',
            entitySet: 'MyNotificationItems',
            longTextEntitySet: 'MyNotifItemLongTexts',
            page: 'NotificationItemDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemNoteDelete.action',

        };
    }

    static notificationTask() {
        return {
            component: 'TaskLongText',
            name: 'NotificationTask',
            entitySet: 'MyNotificationTasks',
            longTextEntitySet: 'MyNotifTaskLongTexts',
            page: 'NotificationTaskDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationTaskCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationTaskNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationTaskNoteDelete.action',

        };
    }

    static notificationActivity() {
        return {
            component: 'ActivityLongText',
            name: 'NotificationActivity',
            entitySet: 'MyNotificationActivities',
            longTextEntitySet: 'MyNotifActivityLongTexts',
            page: 'NotificationActivityDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationActivityCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationActivityNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationActivityNoteDelete.action',

        };
    }

    static notificationItemActivity() {
        return {
            component: 'ItemActivityLongText',
            name: 'NotificationItemActivity',
            entitySet: 'MyNotificationItemActivities',
            longTextEntitySet: 'MyNotifItemActivityLongTexts',
            page: 'NotificationItemActivityDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemActivityCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemActivityNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemActivityNoteDelete.action',

        };
    }

    static notificationItemCause() {
        return {
            component: 'ItemCauseLongText',
            name: 'NotificationItemCause',
            entitySet: 'MyNotificationItemCauses',
            longTextEntitySet: 'MyNotifItemCauseLongTexts',
            page: 'NotificationItemCauseDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemCauseCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemCauseNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemCauseNoteDelete.action',

        };
    }

    static notificationItemTask() {
        return {
            component: 'ItemTaskLongText',
            name: 'NotificationItemTask',
            entitySet: 'MyNotificationItemTasks',
            longTextEntitySet: 'MyNotifItemTaskLongTexts',
            page: 'NotificationItemTaskDetailsPage',
            noteCreateAction: '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationItemTaskCreate.action',
            noteUpdateAction: '/SAPAssetManager/Actions/Notes/Update/NotificationItemTaskNoteUpdate.action',
            noteDeleteAction: '/SAPAssetManager/Actions/Notes/Delete/NotificationItemTaskNoteDelete.action',

        };
    }

    static workOrderHistory() {
        return {
            component: 'HistoryLongText',
            name: 'WorkOrderHistory',
            entitySet: 'WorkOrderHistories',
            longTextEntitySet: 'WorkOrderHistoryTexts',
            page: 'EquipmentDetailsPage',
        };
    }

    static confirmation() {
        return {
            component: 'LongText',
            name: 'Confirmation',
            entitySet: 'Confirmations',
            longTextEntitySet: 'ConfirmationLongTexts',
            page: 'ConfirmationDetailsPage',
        };
    }
    
    static mileage() {
        return {
            component: 'LongText',
            name: 'Confirmation',
            entitySet: 'Confirmations',
            longTextEntitySet: 'ConfirmationLongTexts',
            page: 'ServiceOrderMileageAddEdit',
        };
    }

    static funcloc() {
        return {
            component: 'FuncLocLongText_Nav',
            name: 'MyFunctionalLocation',
            entitySet: 'MyFunctionalLocations',
            longTextEntitySet: 'MyFuncLocLongTexts',
            page: 'FunctionalLocationDetails',
        };
    }

    static equipment() {
        return {
            component: 'EquipmentLongText_Nav',
            name: 'MyEquipment',
            entitySet: 'MyEquipments',
            longTextEntitySet: 'MyEquipLongTexts',
            page: 'EquipmentDetails',
        };
    }

    static purchaseOrder(context) {
        return {
            component: 'PurchaseOrderHeaderLongText_Nav',
            name: 'PurchaseOrderHeader',
            entitySet: 'PurchaseOrderHeaders',
            longTextEntitySet: 'PurchaseOrderHeaderLongTexts',
            page: 'PurchaseOrderDetailsPage',
            filter: "$filter=ObjectKey eq '" + context.binding.PurchaseOrderId + "' and TextObjType eq 'EKKO'",
        };
    }
}
