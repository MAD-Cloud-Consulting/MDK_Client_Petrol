import {CreateUpdateFunctionalLocationEventLibrary as LibFLOC} from '../FunctionalLocationLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function FunctionalLocationCreateUpdateOnPageLoad(context) {
    // clear the geometry cache
    ApplicationSettings.setString(context,'Geometry', '');

    hideCancel(context);
    LibFLOC.onPageLoad(context);
    style(context, 'DiscardButton');

    libCom.saveInitialValues(context);
}
