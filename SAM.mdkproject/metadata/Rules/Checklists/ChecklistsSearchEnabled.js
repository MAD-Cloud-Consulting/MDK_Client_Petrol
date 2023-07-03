import checklistsCount from './ChecklistsCount';

export default function ChecklistsSearchEnabled(context) {
    return checklistsCount(context.getPageProxy()).then(count => {
        return count !== 0;
    });
}
