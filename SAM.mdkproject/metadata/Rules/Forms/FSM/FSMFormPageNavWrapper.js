import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import navScript from './FSMFormPageNav';

export default function FSMFormPageNavWrapper(context) {
    ApplicationSettings.remove(context, 'XMLTemplateParsed');
    libCom.removeStateVariable(context, ['FSMFormInstanceCurrentChapterIndex', 'OnLoaded', 'FSMFormInstanceChapters', 'FSMFormInstanceControls', 'FSMFormInstanceVisibilityRules', 'FSMFormInstanceControlsInVisibilityRules', 'FSMToastMessage']);
    return navScript(context);
}
