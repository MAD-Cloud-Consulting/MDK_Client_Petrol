import failureModeGroupValue from './NotificationCreateUpdateQMCodeGroupValue';
import libCommon from '../../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function RequiredFields(context) {
    let required = ['NotificationDescription', 'TypeLstPkr'];

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker1').visible; } catch (exc) { return false; } } )()) {
        required.push('PartnerPicker1');
    }

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker2').visible; } catch (exc) { return false; } } )()) {
        required.push('PartnerPicker2');
    }

    if (IsPhaseModelEnabled(context)) {

        //If a Failure Mode Group has been entered then Failure Mode Code is required or else backend will throw an error
        if (failureModeGroupValue(context)) {
            required.push('QMCodeListPicker');
        }

        //If a detection group has been entered then the method is required
        let detectionGroup = libCommon.getTargetPathValue(context, '#Control:DetectionGroupListPicker/#Value');
        if (detectionGroup) {
            required.push('DetectionMethodListPicker');
        }
    }

    //If the user enters an item description then, make the other fields mandatory
    const itemDescription = (() => {
        try {
            return context.evaluateTargetPath('#Control:ItemDescription/#Value');
        } catch (e) {
            return '';
        }
    })();
    const itemPartGroup = (() => {
        try {
            return context.evaluateTargetPath('#Control:PartGroupLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();
    const itemPart = (() => {
        try {
            return context.evaluateTargetPath('#Control:PartDetailsLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();
    const itemDamageGroup = (() => {
        try {
            return context.evaluateTargetPath('#Control:DamageGroupLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();
    const itemDamage = (() => {
        try {
            return context.evaluateTargetPath('#Control:DamageDetailsLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();

    const causeDescription = (() => {
        try {
            return context.evaluateTargetPath('#Control:CauseDescription/#Value');
        } catch (e) {
            return '';
        }
    })();
    const causeGroup = (() => {
        try {
            return context.evaluateTargetPath('#Control:CauseGroupLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();
    const causeCode = (() => {
        try {
            return context.evaluateTargetPath('#Control:CodeLstPkr/#SelectedValue');
        } catch (e) {
            return '';
        }
    })();

    if (causeDescription || causeGroup || causeCode) {
        // If any cause fields are filled out, everything is required
        required.push('CauseGroupLstPkr','CodeLstPkr', 'ItemDescription', 'PartGroupLstPkr','PartDetailsLstPkr','DamageGroupLstPkr','DamageDetailsLstPkr');
    } else if (itemDescription || itemPartGroup || itemPart || itemDamageGroup || itemDamage) {
        // If any item fields are filled out, only item-related fields are required
        required.push('ItemDescription', 'PartGroupLstPkr','PartDetailsLstPkr','DamageGroupLstPkr','DamageDetailsLstPkr');
    }

    return required;
}
