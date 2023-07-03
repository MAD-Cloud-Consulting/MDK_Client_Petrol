import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import skipVisible from '../../Measurements/Points/MeasuringPointSkipVisible';

export default function MeasurementDocumentsCreateChangeSet(pageProxy) {
    let clientData = pageProxy.getClientData();
    if (!skipVisible(pageProxy)) {
        libCommon.setStateVariable(pageProxy, 'FDCMissingCount', 0); //Count of empty reading points
        libCommon.setStateVariable(pageProxy, 'FDCMissingPoints', {}); //Dictionary to keep the missing point numbers
    }
    libCommon.setOnChangesetFlag(pageProxy, true);
    libCommon.resetChangeSetActionCounter(pageProxy);
    libCommon.setStateVariable(pageProxy, 'TransactionType', 'CREATE');
    libCommon.setStateVariable(pageProxy, 'FDCReadingSaved', false); 
    let extension = pageProxy.getControl('FormCellContainer')._control;
    clientData.Points = [];
    clientData.LamPoints = {};
    clientData.Equipment = '';
    clientData.FuncLoc = '';
    clientData.Segment = ['Error'];
    clientData.PRT= false;
    clientData.Operations = '';

    if (!skipVisible(pageProxy)) {
        return extension.executeChangeSet('/SAPAssetManager/Actions/Measurements/MeasurementDocumentsCountEmptyReadings.action').then(() => {
            let missingCount = libCommon.getStateVariable(pageProxy, 'FDCMissingCount');
            if (missingCount > 0) { //Missed readings exist so pop warning dialog
                let messageText = pageProxy.localizeText('validation_missed_readings_x', [missingCount]);
                //let captionText = pageProxy.localizeText('validation_warning');
                let okButtonText = pageProxy.localizeText('continue_text');
                let cancelButtonText = pageProxy.localizeText('cancel');
    
                return libCommon.showWarningDialog(pageProxy, messageText, undefined, okButtonText, cancelButtonText).then(() => {
                    //User said OK to skip the missed readings
                    return extension.executeChangeSet('/SAPAssetManager/Actions/Measurements/MeasurementDocumentsCreateChangeSet.action').then(() => {
                        return applyFilters(false);
                    });
                }, function() { //User wants to cancel processing because of the missed readings
                    return applyFilters(true);
                });
            } else { //No missed readings, so process all points normally
                return extension.executeChangeSet('/SAPAssetManager/Actions/Measurements/MeasurementDocumentsCreateChangeSet.action').then(() => {
                    return applyFilters(false);
                });
            }
        });
    } else { //Skip is allowed, so process everything normally
        return extension.executeChangeSet('/SAPAssetManager/Actions/Measurements/MeasurementDocumentsCreateChangeSet.action').then(() => {
            return applyFilters(false);
        });
    }

    /**
     * Apply the error and empty filters if necessary
     */
    function applyFilters(showMissed) {
        let points = clientData.Points;
        let segment = [];
        const bindingType = pageProxy.binding['@odata.type'];
        const operation = '#sap_mobile.MyWorkOrderOperation';
        if (!libVal.evalIsEmpty(points) || showMissed) {    
            var Filters = [];
            var controls = [];

            if (!libVal.evalIsEmpty(points)) {
                for (let index in points) {
                    if (bindingType === operation) {
                        Filters.push(
                            {
                                'FilterType': 'ValidationError',
                                'FilterProperty': 'PRTPoint/Point',
                                'FilterValue': points[index],
                            });
                    } else {
                        Filters.push(
                            {
                                'FilterType': 'ValidationError',
                                'FilterProperty': 'Point',
                                'FilterValue': points[index],
                            });
                    }
                }
                segment.push('Error');
            } else {
                if (bindingType === operation) {
                    Filters.push(
                        {
                            'FilterType': 'ValidationError',
                            'FilterProperty': 'PRTPoint/Point',
                            'FilterValue': '',
                        });
                } else {
                    Filters.push(
                        {
                            'FilterType': 'ValidationError',
                            'FilterProperty': 'Point',
                            'FilterValue': '',
                        });
                }
            }
            if (showMissed) { //Display the empty points
                controls.push(
                    {
                        'ControlName': 'ReadingSim',
                        'ControlType': 'Control.Type.FormCell.SimpleProperty',
                        'ControlValueExits' : false,
                        'RequiredFieldsProperty' : 'RequiredFields',
                    }
                );
                controls.push(
                    {
                        'ControlName': 'ValuationCodeLstPkr',
                        'ControlType': 'Control.Type.FormCell.ListPicker',
                        'ControlValueExits' : false,
                        'RequiredFieldsProperty' : 'RequiredFields',
                    }
                );
                segment.push('Empty');
            }
            //Pass in an empty controls filter to FDC in order to satisfy the OR clause
            Filters.push(
                {
                    'FilterType': 'Control',
                    'Controls': controls,
                });

            clientData.Segment = segment;
            pageProxy.getControl('FormCellContainer')._control.applyFilter(Filters);
        }
        return true;
    }
}
