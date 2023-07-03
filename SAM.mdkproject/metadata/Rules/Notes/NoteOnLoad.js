import style from '../Common/Style/StyleFormCellButton';
import hideCancel from '../ErrorArchive/HideCancelForErrorArchiveFix';

export default function NoteOnLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
}
