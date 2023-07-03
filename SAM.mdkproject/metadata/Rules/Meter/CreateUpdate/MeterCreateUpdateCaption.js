import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterCreateUpdateCaption(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (meterTransactionType === 'INSTALL') {
        return context.localizeText('meter_install');
    } else if (meterTransactionType === 'REMOVE') {
        return context.localizeText('meter_remove');
    } else if (meterTransactionType === 'REPLACE' ) {
        return `${context.localizeText('replace_meter')}: ${context.localizeText('uninstall_meter')}`;
    } else if (meterTransactionType === 'REP_INST' ) {
        return `${context.localizeText('replace_meter')}: ${context.localizeText('install_meter')}`;
    } else if (meterTransactionType === 'INSTALL_EDIT' || meterTransactionType === 'REMOVE_EDIT' || meterTransactionType === 'REPLACE_EDIT' || meterTransactionType === 'REP_INST_EDIT') {
        return context.localizeText('meter_edit');
    }
    return '';
}
