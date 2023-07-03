import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import common from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import libNotif from '../NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function NotificationCreateUpdateOnPageLoad(context) {
    // Create empty promise in the event of QM creation. Forces rule to wait until read is completed.
    let QMRead = Promise.resolve();
    hideCancel(context);
    var caption;
    var onCreate = common.IsOnCreate(context);
    var container = context.getControls()[0];
    var binding = context.binding;

    // clear the geometry cache
    ApplicationSettings.setString(context, 'Geometry', '');
    common.saveInitialValues(context);

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        caption = context.localizeText('record_defect');
    } else {
        if (onCreate) {
            caption = context.localizeText('add_notification');
        } else {
            caption = context.localizeText('edit_notification');

            if (!common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            ///Notification type can't be edit on local notifications
            if (!onCreate && common.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
                container.getControl('TypeLstPkr').setEditable(false);
            }
            let formCellContainer = context.getControl('FormCellContainer');
            let stylizer = new Stylizer(['GrayText']);
            let typePkr = formCellContainer.getControl('TypeLstPkr');
            stylizer.apply(typePkr, 'Value');

            // QM-Specific
            if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                    QMRead = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
                        if (result && result.length > 0) {
                            typePkr.setValue(result.getItem(0).QMNotifType, true).setEditable(false);
                        }
                    });
                }
            }
            
            //Malfunction date/time
            let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
            let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
            let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
            let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
            let startSwitch = formCellContainer.getControl('BreakdownStartSwitch');
            let endSwitch = formCellContainer.getControl('BreakdownEndSwitch');
            let breakdown = formCellContainer.getControl('BreakdownSwitch').getValue();

            if (breakdown) {
                startDate.setVisible(true);
                startTime.setVisible(true);
                endDate.setVisible(true);
                endTime.setVisible(true);
                startSwitch.setVisible(true);
                endSwitch.setVisible(true);
            }

            if (startSwitch.getValue()) {
                startDate.setEditable(true);
                startTime.setEditable(true);
            }

            if (endSwitch.getValue()) {
                endDate.setEditable(true);
                endTime.setEditable(true);
            }
        }
    }

    context.setCaption(caption);
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        libNotif.NotificationTaskActivityCodeQuery(context, 'CatTypeCauses', 'CauseCodeGroup').then(query => {
            let specifier = container.getControl('CodeLstPkr').getTargetSpecifier();
            specifier.setQueryOptions(query);
            container.getControl('CodeLstPkr').setTargetSpecifier(specifier);
        });
    }

    if (libNotif.getAddFromJobFlag(context)) {
        container.getControl('EquipHierarchyExtensionControl').setEditable(true);
        container.getControl('FuncLocHierarchyExtensionControl').setEditable(true);
    }

    style(context, 'DiscardButton');
     //Set Failure Group and Detection Group
    libNotif.setFailureAndDetectionGroupQuery(context).then(() => {
        common.saveInitialValues(context);
    });

    if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        let typePicker = context.getControl('FormCellContainer').getControl('TypeLstPkr');
        let specifier = typePicker.getTargetSpecifier();

        specifier.setEntitySet('OrderTypes');
        specifier.setQueryOptions(`$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setDisplayValue('{{#Property:EAMNotifType}} - {{#Property:OrderTypeDesc}}');
        specifier.setReturnValue('{EAMNotifType}');

        typePicker.setTargetSpecifier(specifier).then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${binding.InspectionLot_Nav.WOHeader_Nav.OrderType}' and PlanningPlant eq '${binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}'`).then(function(result) {
                if (result.length === 1) {
                    typePicker.setValue(result.getItem(0).EAMNotifType);
                }
            });
        });
    }

    setPartnerPickers(context, container).then(() => {
        return QMRead;
    });

}

export function setPartnerPickers(context, formCellContainer) {
    const partnerType1 = common.getStateVariable(context, 'partnerType1');
    const partnerType2 = common.getStateVariable(context, 'partnerType2');
    let partnerSpecifiers = [];
    
    if (common.isDefined(partnerType1)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType1, formCellContainer.getControl('PartnerPicker1'))) ;
    }

    if (common.isDefined(partnerType2)) {
        partnerSpecifiers.push(libNotif.setPartnerPickerTarget(partnerType2, formCellContainer.getControl('PartnerPicker2')));
    }

    return Promise.all(partnerSpecifiers);
}
