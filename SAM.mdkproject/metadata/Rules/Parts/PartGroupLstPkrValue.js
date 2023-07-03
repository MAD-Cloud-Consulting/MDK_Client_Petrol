import libCommon from '../Common/Library/CommonLibrary';

export default function PartGroupLstPkrValue(context) {
    try	{
        var tmp = libCommon.getTargetPathValue(context, '#Control:PartGroupLstPkr/#Value');
        return tmp[0] !== undefined ? String(tmp[0].ReturnValue) : '';
    } catch (exception)	{
        return undefined;
    }
}
