import NotificationItemTaskCreateUpdateCode from '../Item/Cause/CreateUpdate/NotificationItemCauseCreateUpdateCode';
import NotificationItemCreateUpdateDamage from '../Item/CreateUpdate/NotificationItemCreateUpdateDamage';
import NotificationItemCreateUpdatePart from '../Item/CreateUpdate/NotificationItemCreateUpdatePart';

/**
* Update Part Group, Damage Group, and Cause Group pickers
* after Type, FLOC, or Equipment changes
* @param {IClientAPI} context
*/
export default function UpdateGroupPickers(context) {
	let partGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:PartGroupLstPkr');
	partGroupPicker.reset().then(() => NotificationItemCreateUpdatePart(partGroupPicker));

	let damageGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:DamageGroupLstPkr');
	damageGroupPicker.reset().then(() => NotificationItemCreateUpdateDamage(damageGroupPicker));

	let causeGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:CauseGroupLstPkr');
	causeGroupPicker.reset().then(() => NotificationItemTaskCreateUpdateCode(causeGroupPicker));
}
