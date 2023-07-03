import NotesCount from './NotesCount';

export default function NotePopoverSelectionText(clientApi) {
    clientApi.getPageProxy = () => clientApi;
    return NotesCount(clientApi).then(e => {
      return e === 0 ? '$(L, add_note)' : '$(L, add_to_note)';
    });
}
