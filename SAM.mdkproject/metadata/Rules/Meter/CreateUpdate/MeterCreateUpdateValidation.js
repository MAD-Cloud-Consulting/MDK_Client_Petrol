import libCom from '../../Common/Library/CommonLibrary';
import libMeter from '../Common/MeterLibrary';

 function validateRequiredField(context,control) {
    if (!libCom.isDefined(control.getValue())) {
        const message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, control, message);
        return Promise.reject();
    } else {
        return Promise.resolve(true);
    }
}

export default function MeterCreateUpdateValidation(context) {
    const meterTransactionType = libMeter.getMeterTransactionType(context);

    // if it is meter removal/installation transaction - movement type, receiving plant and storage location are mandatory if visible
    if (['REMOVE', 'INSTALL'].includes(meterTransactionType)) {
        const dict = libCom.getControlDictionaryFromPage(context);

        const MovementTypeLstPkr = dict.MovementTypeLstPkr;
        const ReceivingPlantLstPkr = dict.ReceivingPlantLstPkr;
        const StorageLocationLstPkr = dict.StorageLocationLstPkr;

        MovementTypeLstPkr.clearValidation();
        ReceivingPlantLstPkr.clearValidation();
        StorageLocationLstPkr.clearValidation();

        const validations = [];

        if (ReceivingPlantLstPkr.visible) {
            validations.push(validateRequiredField(context, ReceivingPlantLstPkr));
        }

        if (MovementTypeLstPkr.visible) {
            validations.push(validateRequiredField(context, MovementTypeLstPkr));
        }

        if (StorageLocationLstPkr.visible) {
            validations.push(validateRequiredField(context, StorageLocationLstPkr));
        }

        return Promise.all(validations).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    return true;
 }
