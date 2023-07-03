export function getWorkOrderMenuItems() {
    return [
        {
            '_Name': 'Add_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_order)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderNotificationCreateNav.js',
        },
        {
            '_Name': 'Edit_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
        {
            '_Name': 'Start_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            'Text': '$(L,start)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/WorkOrderStart.js',
        },
        {
            '_Name': 'Hold_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/hold.png, /SAPAssetManager/Images/hold.android.png)',
            'Text': '$(L,hold)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/WorkOrderHold.js',
        },
        {
            '_Name': 'Transfer_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
            'Text': '$(L,transfer)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderTransferStatus.js',
        },
        {
            '_Name': 'Complete_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,complete)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderCompleteFromWOListSwipe.js',
        },
        {
            '_Name': 'Review_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,review)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderCompleteFromWOListSwipe.js',
        },
        {
            '_Name': 'Reject_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,reject)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
        },
    ];
}

export function getNotificationMenuItems() {
    return [
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '',
        },
        {
            '_Name': 'Add_Item',
            'Image': '$(PLT, /SAPAssetManager/Images/additem.png, /SAPAssetManager/Images/additem.android.png)',
            'Text': '$(L,add_item)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemCreateNav.js',
        },
        {
            '_Name': 'Start_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            'Text': '$(L,start)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/NotificationMobileStatusHandler.js',
        },
        {
            '_Name': 'End_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,complete)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/MobileStatus/NotificationMobileStatusHandler.js',
        },
        {
            '_Name': 'Edit_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/NotificationUpdateNav.js',
        },
        {
            '_Name': 'Delete_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}

export function getOperationMenuItems() {
    return [
        {
            '_Name': 'Add_WorkOrder',
            'Image': '$(PLT, /SAPAssetManager/Images/add.png, /SAPAssetManager/Images/add.android.png)',
            'Text': '$(L,add_operation)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_Notification',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/WorkOrderOperationNotificationCreateNav.js',
        },
        {
            '_Name': 'Edit_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationUpdateNav.js',
        },
        {
            '_Name': 'Delete_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        {
            '_Name': 'Accept_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/accept.png, /SAPAssetManager/Images/accept.android.png)',
            'Text': '$(L,accept)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationAcceptFromOpListSwipe.js',
        },
        {
            '_Name': 'Reject_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/reject.png, /SAPAssetManager/Images/reject.android.png)',
            'Text': '$(L,reject)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationRejectFromOpListSwipe.js',
        },
        {
            '_Name': 'Travel_to_Destination',
            'Image': '$(PLT, /SAPAssetManager/Images/enroute.png, /SAPAssetManager/Images/enroute.android.png)',
            'Text': '$(L,enroute)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationTravelFromOpListSwipe.js',
        },
        {
            '_Name': 'Arrive_at_Destination',
            'Image': '$(PLT, /SAPAssetManager/Images/onsite.png, /SAPAssetManager/Images/onsite.android.png)',
            'Text': '$(L,onsite)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationOnsiteFromOpListSwipe.js',
        },
        {
            '_Name': 'Start_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            'Text': '$(L,start)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationStartFromOpListSwipe.js',
        },
        {
            '_Name': 'Hold_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/hold.png, /SAPAssetManager/Images/hold.android.png)',
            'Text': '$(L,hold)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationHoldFromOpListSwipe.js',
        },
        {
            '_Name': 'Transfer_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
            'Text': '$(L,transfer)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationTransferStatus.js',
        },
        {
            '_Name': 'Complete_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,complete)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/Operations/OperationCompleteFromWOListSwipe.js',
        },
        {
            '_Name': 'Confirm_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/confirm.png, /SAPAssetManager/Images/confirm.android.png)',
            'Text': '$(L,confirm)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/Operations/OperationCompleteFromWOListSwipe.js',
        },
        {
            '_Name': 'Unconfirm_Operation',
            'Image': '$(PLT, /SAPAssetManager/Images/unconfirm.png, /SAPAssetManager/Images/unconfirm.android.png)',
            'Text': '$(L,unconfirm)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationUnconfirmStatus.js',
        },
    ];
}

export function getSubOperationMenuItems() {
    return [
        {
            '_Name': 'Add_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_suboperation)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Edit_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/SubOperationUpdateNav.js',
        },
        {
            '_Name': 'Delete_SubOperation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
        {
            '_Name': 'Start_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            'Text': '$(L,start)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationStartStatus.js',
        },
        {
            '_Name': 'Hold_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/hold.png, /SAPAssetManager/Images/hold.android.png)',
            'Text': '$(L,hold)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationHoldStatus.js',
        },
        {
            '_Name': 'Accept_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/accept.png, /SAPAssetManager/Images/accept.android.png)',
            'Text': '$(L,accept)',
            'Mode': 'Normal',
            'Style':'ContextMenuGreen',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationAcceptStatus.js',
        },
        {
            '_Name': 'Reject_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/reject.png, /SAPAssetManager/Images/reject.android.png)',
            'Text': '$(L,reject)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationRejectStatus.js',
        },
        {
            '_Name': 'Travel_to_Destination',
            'Image': '$(PLT, /SAPAssetManager/Images/enroute.png, /SAPAssetManager/Images/enroute.android.png)',
            'Text': '$(L,enroute)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationTravelStatus.js',
        },
        {
            '_Name': 'Arrive_at_Destination',
            'Image': '$(PLT, /SAPAssetManager/Images/onsite.png, /SAPAssetManager/Images/onsite.android.png)',
            'Text': '$(L,onsite)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationOnsiteStatus.js',
        },
        {
            '_Name': 'Transfer_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
            'Text': '$(L,transfer)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationTransferStatus.js',
        },
        {
            '_Name': 'Complete_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
            'Text': '$(L,complete)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/SubOperations/SubOperationCompleteFromListSwipe.js',
        },
        {
            '_Name': 'Confirm_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/confirm.png, /SAPAssetManager/Images/confirm.android.png)',
            'Text': '$(L, confirm)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/SubOperations/SubOperationCompleteFromListSwipe.js',
        },
        {
            '_Name': 'Unconfirm_Suboperation',
            'Image': '$(PLT, /SAPAssetManager/Images/unconfirm.png, /SAPAssetManager/Images/unconfirm.android.png)',
            'Text': '$(L, unconfirm)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationUnconfirmStatus.js',
        },
    ];
}

export function getEquipmentMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromEquipment',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L,add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
        },
        {
            '_Name': 'Add_WorkOrderFromEquipment',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L,add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode':  'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
    ];
}

export function getFunctionalLocationMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addnotif.png, /SAPAssetManager/Images/addnotif.android.png)',
            'Text': '$(L, add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
        },
        {
            '_Name': 'Add_WorkOrderFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L, add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
        },
        {
            '_Name': 'Take_Reading',
            'Image': '$(PLT, /SAPAssetManager/Images/reading.png, /SAPAssetManager/Images/reading.android.png)',
            'Text': '$(L,take_readings)',
            'Mode':  'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
        },
    ];
}

export function getTimesheetsMenuItems() {
    return [
        {
            '_Name': 'Add_NotificationFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/add.png, /SAPAssetManager/Images/add.android.png)',
            'Text': '$(L, add_notification)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Add_WorkOrderFromFloc',
            'Image': '$(PLT, /SAPAssetManager/Images/addorder.png, /SAPAssetManager/Images/addorder.android.png)',
            'Text': '$(L, add_workorder)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_Timesheet',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

export function getConfirmationsMenuItems() {
    return [
        {
            '_Name': 'Edit_Confirmation',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L,edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsAddPopover.action',
        },
        {
            '_Name': 'Delete_Confirmation',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L,delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

export function getDocumentsMenuItems() {
    return [
        {
            '_Name': 'Delete_Document',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}

export function getMeasurementDocumentsMenuItems() {
    return [
        {
            '_Name': 'Edit_MeasurementDocument',
            'Image': '$(PLT, /SAPAssetManager/Images/edit_context.png, /SAPAssetManager/Images/edit_context.android.png)',
            'Text': '$(L, edit)',
            'Mode': 'Normal',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
        {
            '_Name': 'Delete_MeasurementDocument',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/WorkOrders/WorkOrderUpdateNav.js',
        },
    ];
}

export function getRemindersMenuItems() {
    return [
        {
            '_Name': 'Delete_Entry',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}

export function getErrorArchiveMenuItems() {
    return [
        {
            '_Name': 'Delete_Entry',
            'Image': '$(PLT, /SAPAssetManager/Images/trash.png, /SAPAssetManager/Images/trash.android.png)',
            'Text': '$(L, delete)',
            'Mode': 'Deletion',
            'OnSwipe': '/SAPAssetManager/Rules/ContextMenu/ContextMenuDelete.js',
        },
    ];
}
