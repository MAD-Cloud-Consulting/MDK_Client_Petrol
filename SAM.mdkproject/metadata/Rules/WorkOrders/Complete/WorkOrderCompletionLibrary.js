import libCom from '../../Common/Library/CommonLibrary';
import lib from './WorkOrderCompletionLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libDigSig from '../../DigitalSignature/DigitalSignatureLibrary';
import libFeatures from '../../UserFeatures/UserFeaturesLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

const STEPS_CONST = 'CompleteActions';
const OPERATION_FLOW_CONST = 'operation';
const SUB_OPERATION_FLOW_CONST = 'suboperation';

export default class WorkOrderCompletionLibrary {

    constructor() {
        this._instance = null;
        this._flow = ''; // 'operation', 'suboperation', '' (default) = 'WO'
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    static getStepNames() {
        return ['expenses', 'mileage', 'notification', 'digit_signature', 'signature', 'smartforms', 'time', 'note', 'lam'];
    }

    getCompletionFlow() {
        return this._flow;
    }

    setCompletionFlow(flow) {
        this._flow = flow;
    }

    isWOFlow() {
        return this.getCompletionFlow() !== OPERATION_FLOW_CONST && this.getCompletionFlow() !== SUB_OPERATION_FLOW_CONST;
    }

    isOperationFlow() {
        return this.getCompletionFlow() === OPERATION_FLOW_CONST;
    }

    isSubOperationFlow() {
        return this.getCompletionFlow() === SUB_OPERATION_FLOW_CONST;
    }

    initSteps(context) {
        let steps = {};
        const names = lib.getStepNames();

        names.forEach((name) => {
            steps[name] = {
                value: '',
                data: '',
                visible: false,
                isMandatory: false,
                link: '',
            };

            switch (name) {
                case 'expenses': {
                    steps[name].count = 0;
                    steps[name].visible = libFeatures.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Expense.global').getValue());
                    break;
                }
                case 'mileage': {
                    steps[name].visible = libFeatures.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/MileageReport.global').getValue());
                    break;
                }
                case 'notification': {
                    steps[name].initialData = '';
                    break;
                }
                case 'time': {
                    steps[name].isMandatory = false;
                    steps[name].visible = true;
                    steps[name].lam = '';
                    break;
                }
                case 'note': {
                    steps[name].visible = libSuper.checkReviewRequired(context, context.binding);
                }
            }
        });

        if (this.isWOFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') === 'O');
            steps.signature.isMandatory = true;
       
            steps.digit_signature.visible = libDigSig.isWODigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isWODigitalSignatureMandatory(context);
        } else if (this.isOperationFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'O');
            steps.signature.isMandatory = true;
       
            steps.digit_signature.visible = libDigSig.isOPDigitalSignatureEnabled(context);
            steps.digit_signature.isMandatory = libDigSig.isOPDigitalSignatureMandatory(context);
        } else if (this.isSubOperationFlow()) {
            steps.signature.visible = !libVal.evalIsEmpty(libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete')) && (libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') === 'Y' || libCom.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') === 'O');
            steps.signature.isMandatory = true;

            steps.mileage.visible = false;
            steps.expenses.visible = false;
        }

        libCom.setStateVariable(context, STEPS_CONST, steps);
    }

    static getSteps(context) {
        return libCom.getStateVariable(context, STEPS_CONST) || {};
    }

    static clearSteps(context) {
        libCom.setStateVariable(context, STEPS_CONST, {});
    }

    static getStep(context, stepKey) {
        let steps = lib.getSteps(context);
        return steps[stepKey] || {};
    }

    static getStepValue(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return step.value || '';
    }

    static getStepDataLink(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return step.link || '';
    }

    static getStepData(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return JSON.parse(step.data || '{}');
    }

    static isStepDataExist(context, stepKey) {
        let step = lib.getStep(context, stepKey);
        return step && step.data;
    }

    static isStepVisible(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return !!step.visible;
    }

    static isStepMandatory(context, stepKey) {
        let step = lib.getStep(context, stepKey);    
        return !!step.isMandatory;
    }

    static resetStep(context, link) {
        let properties = {
            'OnSuccess': '',
            'OnFailure': '',
        };

        if (link) {
            let entitySet = link.split('(')[0];
            properties.Target = {
                'EntitySet': entitySet,
                'EditLink':  link,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            };
        }

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 
            'Properties': properties,
        }).catch((failure) => {
            Logger.error('Discard failed', failure);
        });
    }

    static updateStepState(context, stepKey, data) {
        let step = lib.getStep(context, stepKey);    
        let updatedData = Object.assign(step, data);
        lib.getSteps(context)[stepKey] = updatedData;
    }

    openMainPage(context, simulateBackNavigation = true, navAction) {
        let binding;
        let bindingString = this.getInitialBinding(context);
        if (bindingString) {
            binding = JSON.parse(bindingString);
            if (context.getPageProxy && context.getPageProxy().setActionBinding) {
                context.getPageProxy().setActionBinding(binding);
            } else if (context.setActionBinding) {
                context.setActionBinding(binding);
            }
        }
        lib.setConfirmationType(context, '');

        let action = '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action';
        if (simulateBackNavigation) {
            action = '/SAPAssetManager/Actions/Common/CloseChildModal.action';
        } else if (navAction) {
            action = navAction;
        }

        return context.executeAction(action);
    }

    static validateSteps(context) {
        let steps = lib.getSteps(context);
        let valid = true;

        if (steps) {
            valid = !Object.keys(steps).find(key => {
                let step = steps[key];
                return step.isMandatory && !step.value && step.visible;
            });
        }
    
        return valid;
    }

    setCompleteFlag(context, value) {
        libCom.setStateVariable(context, this.getCompleteFlagName(context), value);
    }

    getCompleteFlagName(context) {
        let path = '';

        if (this.isWOFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/WorkOrderCompletionFlag.global';
        } else if (this.isOperationFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/OperationCompletionFlag.global';
        } else if (this.isSubOperationFlow()) {
            path = '/SAPAssetManager/Globals/WorkOrder/SubOperationCompletionFlag.global';
        }

        return path ? context.getGlobalDefinition(path).getValue() : false;
    }

    getInitialBinding(context) {
        return ApplicationSettings.getString(context, this.getStoredBindingKey());
    }

    getBinding(context) {
        let binding = libCom.getBindingObject(context);

        if (binding) {
            if (this.isWOFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                return binding;
            } else if (this.isOperationFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return binding;
            } else if (this.isSubOperationFlow() && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                return binding;
            }
        }

        let bindingString = this.getInitialBinding(context);
        if (bindingString) {
            binding = JSON.parse(bindingString);
        }
        libCom.setStateVariable(context, 'BINDINGOBJECT', binding);
        return binding;
    }

    setBinding(context, binding) {
        libCom.setStateVariable(context, 'BINDINGOBJECT', binding);
        ApplicationSettings.setString(context, this.getStoredBindingKey(), JSON.stringify(binding));
    }

    deleteBinding(context) {
        ApplicationSettings.remove(context, this.getStoredBindingKey());
    }

    getStoredBindingKey() {
        if (this.isWOFlow()) {
            return 'WO_Binding';
        } else if (this.isOperationFlow()) {
            return 'Operation_Binding';
        } else if (this.isSubOperationFlow()) {
            return 'Sub_Operation_Binding';
        }
        return '';
    }

    static setConfirmationType(context, type) {
        libCom.setStateVariable(context, 'ConfirmationType', type);
    }

    static getConfirmationType(context) {
        return libCom.getStateVariable(context, 'ConfirmationType') || '';   
    }

    static setValidationMessages(context, resetFlag) {
        let controls = context.getPageProxy().getControl('SectionedTable').getSection('MandatorySection').getBindingObject()._array;
        let steps = lib.getSteps(context);
        let stepNameAndControlIndexMapping = {
            'digit_signature': 3, 
            'signature': 1, 
            'smartforms': 5,
        };
        if (steps) {
            Object.keys(steps).forEach(key => {
                let step = steps[key];
                let isNotValid = step.isMandatory && !step.value && step.visible;
                if (stepNameAndControlIndexMapping[key]) {
                    controls[stepNameAndControlIndexMapping[key]].rawData.SimplePropertyCell.Visible = resetFlag ? false : isNotValid;
                }
            });
        }
    }

    static resetValidationMessages(context) {
        const resetFlag = true;
        lib.setValidationMessages(context, resetFlag);
    }
}
