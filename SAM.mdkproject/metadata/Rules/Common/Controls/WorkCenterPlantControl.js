import libCommon from '../../Common/Library/CommonLibrary';
import assnType from '../../Common/Library/AssignmentType';
import {PrivateMethodLibrary as operationPrivateLib} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import {PrivateMethodLibrary as subOperationPrivateLib} from '../../SubOperations/SubOperationLibrary';

export default class {

    /**
     * No oneed to check for assignment type level, Because for work order create/update page. we always default from json, unless its edit
     * @param {*} controlProxy 
     */
    static getWorkOrderPageDefaultValue(controlProxy) {
        let binding = controlProxy.getPageProxy().binding;
        return binding && binding.MainWorkCenterPlant ? binding.MainWorkCenterPlant : assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant');
    }

    /**
     * For operation page, if on create and hier.level is 'Operation', get from json default, else default from parent
     * @param {*} controlProxy 
     */
    static getOperationPageDefaultValue(controlProxy) {
        let binding = controlProxy.getPageProxy ? controlProxy.getPageProxy().binding : controlProxy.binding;
        let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy ? controlProxy.getPageProxy() : controlProxy);
        if (onCreate) {
            let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(controlProxy);
            if (assnTypeLevel === 'Operation') {
                let workcenter = assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'WorkCenterPlant');
                if (libCommon.isDefined(workcenter)) {
                    return Promise.resolve(workcenter);
                } else {
                    return Promise.resolve('');
                }
            } else {
                let onChangeSet = libCommon.isOnWOChangeset(controlProxy.getPageProxy ? controlProxy.getPageProxy() : controlProxy);
                return operationPrivateLib._getParentWorkOrder(controlProxy.getPageProxy ? controlProxy.getPageProxy() : controlProxy, onChangeSet).then(parent => {
                    if (parent && parent.MainWorkCenterPlant) {
                        return parent.MainWorkCenterPlant;
                    }
                    return '';
                });
            }
        } else {
            return Promise.resolve(binding.MainWorkCenterPlant);
        }
    }

    /**
     * For sub operation page, if on create and hier.level is 'Operation', get from json default, else default from parent
     * @param {*} controlProxy 
     */
    static getSubOperationPageDefaultValue(controlProxy) {
        let binding = controlProxy.getPageProxy().binding;
        let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());
        if (onCreate) {
            let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(controlProxy);
            if (assnTypeLevel === 'SubOperation') { 
                return assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'WorkCenterPlant');
            } else {
                return subOperationPrivateLib._getParentOperation(controlProxy.getPageProxy()).then(parent => {
                    if (parent && parent.MainWorkCenterPlant) {
                        return parent.MainWorkCenterPlant;
                    }
                    return '';
                });
            }
        } else {
            return binding.MainWorkCenterPlant;
        }
    }
}
