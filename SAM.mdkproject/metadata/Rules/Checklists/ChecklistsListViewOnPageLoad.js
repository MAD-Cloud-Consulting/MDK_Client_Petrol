import checklistsCount from './ChecklistsCount';

export default function checklistsListViewOnPageLoad(context) {

    return checklistsCount(context).then(count => {
        let params=[count];
        context.setCaption(context.localizeText('checklists_x', params));
    });
}

