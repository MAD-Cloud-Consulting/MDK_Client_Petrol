import libCom from '../../Common/Library/CommonLibrary';
export default function TimeCaptureSectionDateTitle(context, dateOffset = 0) {

    let date = new Date();

    // Update the date with an offset
    date.setDate(date.getDate() + dateOffset);

    return libCom.relativeDayOfWeek(date, context) + ', ' + context.formatDate(date);
}
