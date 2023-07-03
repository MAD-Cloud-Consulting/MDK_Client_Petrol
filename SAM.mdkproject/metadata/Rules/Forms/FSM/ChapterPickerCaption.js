import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Show the Chapter Picker Title
* @param {IClientAPI} clientAPI
*/
export default function ChapterPickerCaption(clientAPI) {
    let currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let chapters = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let chapter = chapters[chapters.findIndex((row) => row.index === currentChapterIndex)];
    let total = 0;
    let current;

    for (var j = 0; j < chapters.length; j++) { //Currently displaying total = enabled chapters
        if (chapters[j].isVisible) {
            total++;
            if (chapter.id === chapters[j].id) current = total;
        }
    }
    return clientAPI.localizeText('select_chapters', [current, total]); 
}
