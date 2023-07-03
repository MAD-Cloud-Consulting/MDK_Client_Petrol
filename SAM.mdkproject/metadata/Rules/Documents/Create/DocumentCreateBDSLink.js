import documentCreateBDSLinkNoClose from './DocumentCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../DownloadAndSaveMedia';
import libCom from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function DocumentCreateBDSLink(controlProxy) {
    return documentCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            libCom.setStateVariable(controlProxy, 'ObjectCreatedName', 'Document');
            CreateEntitySuccessMessageNoClosePageWithAutoSync(controlProxy);
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
