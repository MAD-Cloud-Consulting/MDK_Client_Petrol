export default function ReadingNoteValue(context) {
    let value = context.evaluateTargetPath('#Control:NotePicker/#Value');
    if (value.length > 0) {
        return value[0].ReturnValue;
    } else {
        return '';
    }
}
