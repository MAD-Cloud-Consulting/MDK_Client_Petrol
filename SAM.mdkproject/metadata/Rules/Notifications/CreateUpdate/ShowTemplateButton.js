import common from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

/**
* Show/hide "Use Template" button
* @param {IClientAPI} context
*/
export default function ShowTemplateButton(context) {
	return common.IsOnCreate(context) &&
		context.read('/SAPAssetManager/Services/AssetManager.service', 'LongTextTemplates', [], '$top=1')
			.then(template => {
				return Promise.resolve(!ValidationLibrary.evalIsEmpty(template) && template.getItem(0));
			})
			.catch(error => {
				Logger.error('Error in ShowTemplateButton: ' + error);
				return Promise.resolve(false);
			});
}
