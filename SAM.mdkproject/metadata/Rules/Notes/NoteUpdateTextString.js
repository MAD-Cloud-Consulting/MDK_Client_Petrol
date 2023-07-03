import NewTextString from './NoteUpdateNewTextString';
import RemoteTextString from './NoteRemoteTextString';
import {NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteUpdateTextString(pageClientAPI) {
    return NoteLib.prependNoteText(RemoteTextString(pageClientAPI), NewTextString(pageClientAPI));
}
