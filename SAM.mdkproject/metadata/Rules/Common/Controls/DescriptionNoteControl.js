import libCommon from '../Library/CommonLibrary';

export default class {

    /**
     * validation rule that return wether it passes the 40 characters limit
     * 
     * @static
     * @param {IPageProxy} context 
     * @return {Promise}
     * 
     * @memberof DescriptionNote
     */
    static validationCharLimit(context) {
        let descriptionCtrl = context.getControl('FormCellContainer').getControl('DescriptionNote');
        let descriptionValue = descriptionCtrl.getValue() ? descriptionCtrl.getValue().trim() : '';
        let charLimit = libCommon.getAppParam(context, 'WORKORDER', 'DescriptionLength');
        let charLimitInt = parseInt(charLimit);
        descriptionCtrl.setValue(descriptionValue);
 
        if (descriptionValue.length <= charLimitInt) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = [charLimit];
            let message = context.localizeText('validation_maximum_field_length', dynamicParams);
            libCommon.executeInlineControlError(context, descriptionCtrl, message);
            return Promise.reject(false);
        }
    }
}
