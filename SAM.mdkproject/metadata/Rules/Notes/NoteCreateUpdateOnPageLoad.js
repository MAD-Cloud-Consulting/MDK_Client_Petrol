import {NoteLibrary as NoteLib} from './NoteLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function NoteCreateUpdateOnPageLoad(pageClientAPI) {

    NoteLib.createUpdateOnPageLoad(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}
