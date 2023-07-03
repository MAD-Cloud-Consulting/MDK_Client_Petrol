import libCom from '../../Common/Library/CommonLibrary';

/**
* Show the Chapter Picker Values
* @param {IClientAPI} clientAPI
*/
export default function ChapterPickerItems(clientAPI) {

    let json = [];

    let chapters = libCom.getStateVariable(clientAPI, 'FSMFormInstanceChapters');

    for (const element of chapters) {
        if (element.isVisible) {
            json.push({
                'DisplayValue': element.name,
                'ReturnValue': element.id,
            });
        }
    }
    return json;
}
