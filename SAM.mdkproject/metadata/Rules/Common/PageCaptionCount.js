import libCommon from '../Common/Library/CommonLibrary';
/**
 * Put the  current/total count with page name as caption
 * @param {*} context: the page context
 * @param {*} pageLocalizeCaption: the localized name of the page.
 */
export default function PageCaptionCount(context, pageLocalizeCaption) {
   
    let pageName = libCommon.getPageName(context);
    let totalCount = libCommon.getStateVariable(context, 'TotalPageCount');
    let currentPageCount;
    // Get the page name and only allow to modify the total count of the stack from the first page 
    if (pageName === 'PartCreatePage') { 
        // For the first page we will always show the count of 1. Cannot use backStack length as without
        // OnNavigated property, the count for backStack would be 0 for page 1 and 2
        libCommon.setStateVariable(context, 'CurrentPageCount',1);
        currentPageCount = libCommon.getStateVariable(context, 'CurrentPageCount');
    } else {
        // For all other pages, we just increment the count on every other page.
        currentPageCount = libCommon.getStateVariable(context, 'CurrentPageCount') + 1;
        libCommon.setStateVariable(context, 'CurrentPageCount', currentPageCount);
    }
    // Set the caption and format it
    return context.setCaption(context.localizeText(pageLocalizeCaption,[currentPageCount, totalCount]));
}

