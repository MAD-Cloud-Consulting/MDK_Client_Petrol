import libCommon from '../../Common/Library/CommonLibrary';
import lamIsEnabled from '../../LAM/LAMIsEnabled';
import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import CheckIsLam from '../../Confirmations/CheckIsLam';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function ConfirmationCreateUpdateNav(context, override, defaultStart = new Date(), defaultEnd = new Date()) {

    let mConfirmation = {
        '_Start': defaultStart,
        '_End': defaultEnd,
        'IsOnCreate': true,
        'IsWorkOrderChangable': true,
        'IsOperationChangable': true,
        'IsSubOperationChangable': true,
        'IsDateChangable': true,
        'IsFinalChangable': true,
        'SubOperation': '',
        'VarianceReason': '',
        'AccountingIndicator': '',
        'ActivityType': '',
        'Description': '',
        'Operation': '',
        'OrderID': '',
        'Plant': '',
        'IsFinal': false,
        'WorkOrderHeader': undefined,
        'name': 'mConfirmation',
        '_Posting': defaultStart,
    };

    if (override) {
        for (const [key, value] of Object.entries(override)) {
            mConfirmation[key] = value;
        }
    }

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    if (context.constructor.name === 'SectionedTableProxy') {
        context.getPageProxy().setActionBinding(mConfirmation);
    } else {
        context.setActionBinding(mConfirmation);
    }
    ///CreateUpdateConfirmation needs confirmation args in client data
    context.getClientData().confirmationArgs = mConfirmation;
    libCommon.setStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder', false);
    libCommon.removeStateVariable(context, 'LAMConfirmationNum');
    libCommon.removeStateVariable(context, 'LAMConfirmationCounter');
    libCommon.removeStateVariable(context, 'LAMDefaultRow');
    libCommon.removeStateVariable(context, 'LAMCreateType');
    libCommon.removeStateVariable(context, 'LAMConfirmationReadLink');
    libCommon.removeStateVariable(context, 'LAMSignature'); //Set to true before displaying signature screen during confirmation add
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');  //Set to true if confirmation LAM entry needs to be deferred until after signature entry

    // at the time of completion, only the page should be open without creating a changeset
    let action = '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateChangeset.action';
    if (IsCompleteAction(context)) {
        action = '/SAPAssetManager/Actions/Confirmations/ConfirmationsCreateUpdateNav.action';
    }
    return context.executeAction(action).then(() => {
        if (lamIsEnabled(context) && IsNotCompleteAction(context)) {
            //Check to see if the confirmation we just added needs a LAM entry created
            libCommon.setStateVariable(context, 'LAMDefaultRow', '');
            let confirm = libCommon.getStateVariable(context, 'LAMConfirmationNum');
            let counter = libCommon.getStateVariable(context, 'LAMConfirmationCounter');
            if (confirm) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], "$filter=ConfirmationNum eq '" + confirm + "' and ConfirmationCounter eq '" + counter + "'").then(function(results) {
                    if (results && results.length > 0) {
                        let confirmRow = results.getItem(0);
                        return CheckIsLam(context, confirmRow).then((lamDefaultRow) => {
                            if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this confirmation
                                libCommon.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                                libCommon.setStateVariable(context, 'LAMCreateType', 'Confirmation');
                                libCommon.setStateVariable(context, 'LAMConfirmationReadLink', confirmRow['@odata.readLink']);
                                libCommon.setStateVariable(context, 'TransactionType', 'CREATE');
                                let signature = libCommon.getStateVariable(context, 'LAMSignature');
                                if (signature) { //We are capturing a signature first, so defer this action until later
                                    libCommon.removeStateVariable(context, 'LAMSignature');
                                    libCommon.setStateVariable(context, 'LAMConfirmCreate', true);
                                    return Promise.resolve(false);
                                }
                                return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
                            }
                            return Promise.resolve(true);
                        });
                    }
                    return Promise.resolve(false);
                });
            }
            return Promise.resolve(false);
        }
        return Promise.resolve(false);
    });
}

