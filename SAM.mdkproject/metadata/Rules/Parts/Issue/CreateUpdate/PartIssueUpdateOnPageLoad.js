import libPart from '../../PartLibrary';
import style from '../../../Common/Style/StyleFormCellButton';

export default function PartIssueUpdateOnPageLoad(pageClientAPI) {
    style(pageClientAPI, 'DiscardButton');
    libPart.partIssueUpdateFormattedValues(pageClientAPI);
}
