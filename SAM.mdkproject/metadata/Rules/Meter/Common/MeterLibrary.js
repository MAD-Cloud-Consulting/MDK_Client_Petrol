import libCommon from '../../Common/Library/CommonLibrary';
import validation from '../../Common/Library/ValidationLibrary';

export default class {

    static setMeterTransactionType(context, transactionType) {
        let local = false;
        let isuProcessType = '';
    
        if (transactionType && transactionType !== '') {
            isuProcessType = transactionType;
        } else {
            if (context.binding.ISUProcess) {
                isuProcessType = context.binding.ISUProcess;
            } else if (context.binding.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.OrderISULinks);
            } else if (context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks) {
                isuProcessType = this.getISUProcess(context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks);
            }
            
            if (this.isLocal(context.binding)) {
                local = true;
            }
        }
        
        if (local) {
            libCommon.setStateVariable(context, 'TransactionType', isuProcessType + '_EDIT');  
        } else {
            libCommon.setStateVariable(context, 'TransactionType', isuProcessType);  
        }

    }

    static isProcessed(binding) {
        try {
            if ((binding.ISUProcess === 'REMOVE' || binding.ISUProcess === 'REPLACE') && (binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'I0099' || (binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'I0184' || binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'LOC01'))) {
                return true;
            } else if ((binding.ISUProcess === 'INSTALL' || binding.ISUProcess === 'REP_INST') && binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.SystemStatus === 'I0100') {
                return true;
            } else if (binding.DisconnectActivity_Nav.ActivityType === '01' && binding.Device_Nav.DeviceBlocked === true) {
                return true;
            } else if (binding.DisconnectActivity_Nav.ActivityType === '03' && binding.Device_Nav.DeviceBlocked === false) {
                return true;
            } else {
                return false;
            }
        } catch (exc) {
            return false;
        }
    }

    static getMeterTransactionType(context) {
        return libCommon.getStateVariable(context, 'TransactionType');
    }

    static isOnEdit(context) {
        let tranType = this.getMeterTransactionType(context);
        return tranType.includes('EDIT');
    }

    static getISUProcess(orderISUArray) {
        for (let i = 0; i < orderISUArray.length; i ++) {
            if (orderISUArray[i].ISUProcess !== '') {
                return orderISUArray[i].ISUProcess;
            }
        }
        return '';
    }

    static isLocal(binding) {
        if (!validation.evalIsEmpty(binding)) {
            if (binding instanceof Array) {
                for (let i = 0; i < binding.length; i ++) {
                    if (binding[i].hasOwnProperty('@sap.isLocal')) {
                        return true;
                    }
                }
            } else if (!validation.evalIsEmpty(binding.Device_Nav)) {
                return binding.Device_Nav.hasOwnProperty('@sap.isLocal');
            } else {
                binding.hasOwnProperty('@sap.isLocal');
            }
        }
        return false;   
    }

    static isReplace(isuProcessType) {
        if (isuProcessType === 'REPLACE' || isuProcessType === 'REP_INST' ) {
            return true;
        }
        return false;
    }

    /**
     * set the meter reader true/false flag
     * @param {boolean} value 
     */
    static setMeterReaderFlag(value) {
        this._meterReaderFlag = value;
    }

    static getMeterReaderFlag() {
        return this._meterReaderFlag;
    }

}
