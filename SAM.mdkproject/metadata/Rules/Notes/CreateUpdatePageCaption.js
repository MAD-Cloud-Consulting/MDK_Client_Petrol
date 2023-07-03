import {NoteLibrary as NoteLib} from './NoteLibrary';

export default function CreateUpdatePageCaption(pageClientAPI) {
    return NoteLib.getCaption(pageClientAPI);
}
