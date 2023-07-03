import common from '../Common/Library/CommonLibrary';

export default function ChecklistValidation(context) {
	let regex = /^([^~`%*|;'"<>](?!(\\.\\.))){0,5000}$/;
	let input = context.evaluateTargetPath('#Control:Comments/#Value');

	if (regex.test(input)) {
		return true;
	} else {
		common.executeInlineControlError(context, context.evaluateTargetPathForAPI('#Control:Comments'), context.localizeText('illegal_chars', ['~ ` % * | ; \' " < >']));
		return false;
	}
}
