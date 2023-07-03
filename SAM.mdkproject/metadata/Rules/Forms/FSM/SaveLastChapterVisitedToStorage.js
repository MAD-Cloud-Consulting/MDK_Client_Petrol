import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Save the current chapter to permanent storage
* @param {IClientAPI} clientAPI
*/
export default function SaveLastChapterVisitedToStorage(context, chapter) {
    
    if (context.getPageProxy().binding.Closed) return;
    
    let id = libCom.getStateVariable(context, 'CurrentInstanceID');
    ApplicationSettings.setNumber(context, id + '_lastChapter', chapter);
   
}
