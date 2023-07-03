import libCommon from '../../Common/Library/CommonLibrary';

export default function ItemDescription(context) {
    try	{
        var tmp = libCommon.getTargetPathValue(context, '#Control:ItemDescription/#Value');
        return tmp !== undefined ? tmp : '';
    } catch (exception)	{
        return undefined;
    }
}
