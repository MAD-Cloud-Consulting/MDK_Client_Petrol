import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Values for the FSM Form Picker
* @param {IClientAPI} clientAPI
*/
export default function ChapterPickerValue(clientAPI) {
    let chapters = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentSelectedIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let chapter = chapters[chapters.findIndex((row) => row.index === currentSelectedIndex)];
    return chapter.id;
}
