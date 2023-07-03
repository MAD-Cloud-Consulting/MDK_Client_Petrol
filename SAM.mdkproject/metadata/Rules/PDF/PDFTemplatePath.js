/**
* Get Path of the Template
* @param {IClientAPI} clientAPI
*/
import libVal from '../Common/Library/ValidationLibrary';
import GetHTMLPath from '../Documents/GetHTMLPath';
import Logger from '../Log/Logger';
export default function PDFTemplatePath(context) {
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    return context.read(serviceName, 'ReportTemplates', [], '$expand=Document_Nav').then((result) => {
        if (!libVal.evalIsEmpty(result.getItem(0))) {
            return GetHTMLPath(context, result.getItem(0).Document_Nav).then((path) => {
                return path;
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/PDF/PDFRenderFailureBannerMessage.action');
            });
        } else {
            Logger.error('SERVICE REPORT', 'Failed to find the template');
        }
        return Promise.resolve();
    });
}
