import { GlobalVar } from '../Common/Library/GlobalCommon';
import libCommon from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import mobileStatusOverride from '../MobileStatus/MobileStatusUpdateOverride';

export default function WorkOrderSetTransferFields(context) {
    let assnType = libCommon.getWorkOrderAssignmentType(context);
    let ruleData = {};
    let odataDate = new ODataDate();

    let binding = context.binding;

	if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    const TRANSFER = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        ruleData.EmployeeFrom = context.binding.EmployeeFrom;
        ruleData.PlannerGroupFrom = context.binding.PlannerGroupFrom;
        ruleData.UserFrom = context.binding.UserFrom;
        ruleData.WorkCenterFrom = context.binding.WorkCenterFrom;
        switch (assnType) {
            case '1':
            case '2':
            case '3':
            case '4':
            case 'A':
                ruleData.EmployeeTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '5':
                ruleData.PlannerGroupTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '7':
                ruleData.UserTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '6':
                ruleData.WorkCenterTo =(context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[0];
                ruleData.PlantId = (context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[1];

                break;
            case '8':
                ruleData.WorkCenterTo =(context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[0];
                ruleData.PlantId = (context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[1];
                break;
            default:
                // Unknown type. Bail out.
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        }
        ruleData.TransferReason = context.evaluateTargetPath('#Control:TransferReasonLstPkr/#Value')[0].ReturnValue;
        ruleData.TransferNote = context.evaluateTargetPath('#Control:TransferNote/#Value');

        let props = {
            'OrderId': binding.OrderId,
            'OperationNo': binding.OperationNo,
            'SubOperationNo': binding.SubOperationNo,
            'EmployeeFrom': ruleData.EmployeeFrom,
            'EmployeeTo': ruleData.EmployeeTo,
            'PlannerGroupFrom': ruleData.PlannerGroupFrom,
            'PlannerGroupTo': ruleData.PlannerGroupTo,
            'UserFrom': ruleData.UserFrom,
            'UserTo': ruleData.UserTo,
            'WorkCenterFrom': ruleData.WorkCenterFrom,
            'WorkCenterTo': ruleData.WorkCenterTo,
            'HeaderNotes': ruleData.HeaderNotes,
            'TransferReason': ruleData.TransferReason,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
        };

        for (let key in props) {
            if (props[key] === undefined)
                delete props[key];
        }

        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferUpdate.action', 'Properties': {
            'Properties': props,
            'Target':
            {
                'EntitySet': 'WorkOrderTransfers',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': binding['@odata.readLink'],
            },
            'OnSuccess': '',
            'OnFailure': '',
        }});
    } else {
        let rulePromises = [];

        // Get relevant picker information
        switch (assnType) {
            case '1':
            case '2':
            case '3':
            case '4':
            case 'A':
                ruleData.EmployeeFrom = GlobalVar.getUserSystemInfo().get('PERNO');
                ruleData.EmployeeTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '5':
                ruleData.PlannerGroupFrom = GlobalVar.getUserSystemInfo().get('USER_PARAM.IHG');
                ruleData.PlannerGroupTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '7':
                ruleData.UserFrom = libCommon.getSapUserName(context);
                ruleData.UserTo = context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue;
                break;
            case '6':
                ruleData.WorkCenterFrom = context.binding.WOHeader.MainWorkCenter;
                ruleData.WorkCenterTo = (context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[0];
                ruleData.PlantId = (context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[1];
                break;
            case '8':
                ruleData.WorkCenterFrom = context.binding.MainWorkCenter;
                ruleData.WorkCenterTo =(context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[0];
                ruleData.PlantId = (context.evaluateTargetPath('#Control:TransferToLstPkr/#Value')[0].ReturnValue).split('|')[1];
                break;
            default:
                // Unknown type. Bail out.
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        }
        ruleData.TransferReason = context.evaluateTargetPath('#Control:TransferReasonLstPkr/#Value')[0].ReturnValue;
        ruleData.TransferNote = context.evaluateTargetPath('#Control:TransferNote/#Value');

        // Enable/disable toolbar as necessary
        switch (assnType) {
            case '1':
            case '5':
            case '7':
            case '8':
                libCommon.enableToolBar(context, 'WorkOrderDetailsPage', 'IssuePartTbI', false);
                break;
            case '2':
            case '4':
            case '6':
            case 'A':
                libCommon.enableToolBar(context, 'WorkOrderOperationDetailsPage', 'IssuePartTbI', false);
                break;
            case '3':
                libCommon.enableToolBar(context, 'SubOperationDetailsPage', 'IssuePartTbI', false);
                break;
            default:
                // Unknown type. Bail out.
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        }

        // Determine which MobileStatus_Nav to use
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                ruleData.ObjectKey = binding.OrderMobileStatus_Nav.ObjectKey;
                ruleData.ObjectType = binding.OrderMobileStatus_Nav.ObjectType;
                ruleData.ReadLink = binding.OrderMobileStatus_Nav['@odata.readLink'];
                break;
            case '#sap_mobile.MyWorkOrderOperation':
                ruleData.ObjectKey = binding.OperationMobileStatus_Nav.ObjectKey;
                ruleData.ObjectType = binding.OperationMobileStatus_Nav.ObjectType;
                ruleData.ReadLink = binding.OperationMobileStatus_Nav['@odata.readLink'];
                break;
            case '#sap_mobile.MyWorkOrderSubOperation':
                ruleData.ObjectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
                ruleData.ObjectType = binding.SubOpMobileStatus_Nav.ObjectType;
                ruleData.ReadLink = binding.SubOpMobileStatus_Nav['@odata.readLink'];
                break;
            default:
                // Unknown type. Bail out.
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        }

        let props = {
            'OrderId': binding.OrderId,
            'OperationNo': binding.OperationNo,
            'SubOperationNo': binding.SubOperationNo,
            'EmployeeFrom': ruleData.EmployeeFrom,
            'EmployeeTo': ruleData.EmployeeTo,
            'PlannerGroupFrom': ruleData.PlannerGroupFrom,
            'PlannerGroupTo': ruleData.PlannerGroupTo,
            'UserFrom': ruleData.UserFrom,
            'UserTo': ruleData.UserTo,
            'WorkCenterFrom': ruleData.WorkCenterFrom,
            'WorkCenterTo': ruleData.WorkCenterTo,
            'HeaderNotes': ruleData.HeaderNotes,
            'TransferReason': ruleData.TransferReason,
            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
        };

        for (let key in props) {
            if (props[key] === undefined)
                delete props[key];
        }

        let links = [];

        if (props.OrderId) {
            links.push({
                'Property': 'WOHeader',
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': `MyWorkOrderHeaders('${props.OrderId}')`,
                },
            });
            if (props.OperationNo) {
                links.push({
                    'Property': 'WOOperation',
                    'Target': {
                        'EntitySet': 'MyWorkOrderOperations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': `MyWorkOrderOperations(OrderId='${props.OrderId}',OperationNo='${props.OperationNo}')`,
                    },
                });
                if (props.SubOperationNo) {
                    links.push({
                        'Property': 'WOSubOperation',
                        'Target': {
                            'EntitySet': 'MyWorkOrderSubOperations',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'ReadLink': `MyWorkOrderSubOperations(OrderId='${props.OrderId}',OperationNo='${props.OperationNo}',SubOperationNo='${props.SubOperationNo}')`,
                        },
                    });
                }
            }
        }

        // Create the transfer record
        rulePromises.push(context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransfer.action', 'Properties': {
            'Properties': props,
            'CreateLinks': links,
            'OnSuccess': '',
            'OnFailure': '',
        }}));

        // Change the mobile status
        //rulePromises.push(ChangeMobileStatus(context, ruleData.ObjectKey, ruleData.ObjectType, TRANSFER, odataDate.toDBDateTimeString(context), libCommon.getUserGuid(context), ruleData.ReadLink));

        // Need to determine proper mobile status nav link based on type
        const mobileStatusNav = (function(type) {
            switch (type) {
                case '#sap_mobile.MyWorkOrderHeader':
                    return 'OrderMobileStatus_Nav';
                case '#sap_mobile.MyWorkOrderOperation':
                    return 'OperationMobileStatus_Nav';
                case '#sap_mobile.MyWorkOrderSubOperation':
                    return 'SubOpMobileStatus_Nav';
                default:
                    return ''; // Will cause a read failure. Handle error there.
            }
        })(context.binding['@odata.type']);
        const postRule = (function(type) {
            switch (type) {
                case '#sap_mobile.MyWorkOrderHeader':
                    return '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js';
                case '#sap_mobile.MyWorkOrderOperation':
                    return '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js';
                case '#sap_mobile.MyWorkOrderSubOperation':
                    return '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js';
                default:
                    return '';
            }
        })(context.binding['@odata.type']);

        rulePromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/${mobileStatusNav}/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], `$filter=NextOverallStatusCfg_Nav/MobileStatus eq '${TRANSFER}'&$expand=NextOverallStatusCfg_Nav`).then(result => {
            if (result.length > 0) {
                // May be more than one result due to Supervisor feature, but both NextOverallStatus_Nav's will be the same
                return context.executeAction(mobileStatusOverride(context, result.getItem(0).NextOverallStatusCfg_Nav, mobileStatusNav, postRule));
            } else {
                return {};
            }
        }));
        // If Assignment 6 or 8, change work center to visibly remove the object
        switch (assnType) {
            case '6':
                rulePromises.push(context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationWorkCenterUpdate.action', 'Properties': {
                    'Properties': {
                        'MainWorkCenter': ruleData.WorkCenterTo,
                        'MainWorkCenterPlant': ruleData.PlantId,
                    },
                    'Target': {
                        'EntitySet': 'MyWorkOrderOperations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                    'UpdateLinks': [],
                    'DeleteLinks': [],
                    'OnSuccess': '',
                    'OnFailure': '',
                }}));
                break;
            case '8':
                rulePromises.push(context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferWorkCenterUpdate.action', 'Properties': {
                    'Properties': {
                        'MainWorkCenter': ruleData.WorkCenterTo,
                        'MaintenancePlant': ruleData.PlantId,
                    },
                    'Target': {
                        'EntitySet': 'MyWorkOrderHeaders',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                    'UpdateLinks': [],
                    'DeleteLinks': [],
                    'OnSuccess': '',
                    'OnFailure': '',
                }}));
                break;
            default:
                break;
        }

        return Promise.all(rulePromises).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    }
}
