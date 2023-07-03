import { GlobalVar } from './Library/GlobalCommon';
import libComm from './Library/CommonLibrary';

const enableFields = {
    'WorkOrder': 
    {
        '1':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant': 
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '2':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '3':
        {
            'type' : 'WorkOrderSubOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '4':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '5':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '6':
        {
            'type' : 'WorkOrderOperation',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '7':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        '8':
        {
            'type' : 'WorkOrderHeader',
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
        'A':
        {
            'PlanningPlant':
            {
                enabled: true,
                default: null,
            },
            'WorkCenterPlant':
            {
                enabled: true,
                default: null,
            },
            'MainWorkCenter':
            {
                enabled: true,
                default: null,
            },
        },
    },
    'Notification':
    {
        
    },
    'FunctionalLocation':
    {

    },
    'Asset':
    {

    },
};
/**
 * Gets the control field table for the given entity ```type``` given the assignment type
 * @param {String} type one of 'WorkOrder', 'Notification', 'FunctionalLocation', or 'Asset'
 */
export default function GenerateAssnTypeTable(context,type) {
    let fieldparams;
    let assnType = libComm.getWorkOrderAssignmentType(context);
    switch (type) {
        case 'WorkOrder':
            fieldparams = enableFields.WorkOrder[assnType];
            if (assnType === '8' || assnType === '6') {
                fieldparams.MainWorkCenter.default = GlobalVar.getUserSystemInfo().get('USER_PARAM.VAP');
            } else {
                fieldparams.MainWorkCenter.default = null;
            }
            if (GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK')) {
                fieldparams.PlanningPlant.default = GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK');
            } else {
                fieldparams.PlanningPlant.default = GlobalVar.getAppParam().WORKORDER.PlanningPlant;
            }
            if (GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK')) {
                fieldparams.WorkCenterPlant.default = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
                } else {
                fieldparams.WorkCenterPlant.default = fieldparams.PlanningPlant.default;
            }
            break;
        default:
            break;
    }

    return fieldparams;
}
