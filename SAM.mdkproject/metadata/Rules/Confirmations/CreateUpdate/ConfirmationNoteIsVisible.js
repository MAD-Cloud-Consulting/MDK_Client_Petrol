
export default function ConfirmationNoteIsVisible(clientAPI) {
    let binding = clientAPI.binding;

    if (binding.IsOnCreate) {
        return true;
    } else { //During update only show if a note was added during create
        return (binding.LongText && binding.LongText.TextString) ? true : false;
    }
}
