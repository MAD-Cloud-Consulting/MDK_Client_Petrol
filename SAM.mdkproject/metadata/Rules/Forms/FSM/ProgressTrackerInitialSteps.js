import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ProgressTrackerInitialSteps(clientAPI) {

    let steps = [];
    let chapters = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentSelectedIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let navIndex = 0;

    for (let i = 0; i < chapters.length; i++) {
        if (!chapters[i].isSubChapter) { //Don't pass sub-chapters to extension control
            steps.push({
                'State': chapters[i].isVisible ? chapters[i].state: 4,
                'Subtitle': chapters[i].name,
            });
        }
    }

    //Figure out the actual extension index to select. Sub chapters will set the parent chapter as selected
    let chapter = chapters[chapters.findIndex((row) => row.index === currentSelectedIndex)];
    if (chapter) {
        if (chapter.isSubChapter) { //Back up to find the parent chapter
            for (let j = currentSelectedIndex; j >= 0; j--) {
                if (!chapters[j].isSubChapter) {
                    navIndex = chapters[j].extensionIndex;
                    break;
                }
            }
        } else {
            navIndex = chapters[currentSelectedIndex].extensionIndex; //This isn't a sub-chapter, so just use the extension index
        }
    }

    return {
        SelectedStepIndex: navIndex,
        Steps: steps,
    };
}
