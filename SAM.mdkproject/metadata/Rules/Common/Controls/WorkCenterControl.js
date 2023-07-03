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
        return binding && binding.MainWorkCenter ? binding.MainWorkCenter : assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'MainWorkCenter');
    }

    /**
     * For operation page, if on create and hier.level is 'Operation', get from json default, else default from parent
     * @param {*} controlProxy 
     */
    static getOperationPageDefaultValue(controlProxy) {
        let binding = controlProxy.getPageProxy().binding;
        let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());
        if (onCreate) {
            let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(controlProxy);
            if ((assnTypeLevel === 'Operation') && (assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'MainWorkCenter') !== null)) {
                return assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'MainWorkCenter'); 
            } else {
                let onChangeSet = libCommon.isOnWOChangeset(controlProxy.getPageProxy());
                return operationPrivateLib._getParentWorkOrder(controlProxy.getPageProxy(), onChangeSet).then(parent => {
                    if (parent && parent.MainWorkCenter) {
                        return parent.MainWorkCenter;
                    }
                    return '';
                });
            }
        } else {
            return binding.MainWorkCenter;
        }
    }

    /**
     * For sub operation page, if on create and hier.level is 'WorkOrderSubOperation', get from json default, else default from parent
     * @param {*} controlProxy 
     */
    static getSubOperationPageDefaultValue(controlProxy) {
        let binding = controlProxy.getPageProxy().binding;
        let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());
        if (onCreate) {
            let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(controlProxy);
            if ((assnTypeLevel === 'SubOperation') && (assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'MainWorkCenter') !== null)) {
                return assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'MainWorkCenter');
            } else {
                return subOperationPrivateLib._getParentOperation(controlProxy.getPageProxy()).then(parent => {
                    if (parent && parent.MainWorkCenter) {
                        return parent.MainWorkCenter;
                    }
                    return '';
                });
            }
        } else {
            return binding.MainWorkCenter;
        }
    }
}

