import libCommon from '../../Common/Library/CommonLibrary';

export default function PartDetailsLstPkrValue(context) {
    try	{
        var tmp = libCommon.getTargetPathValue(context, '#Control:PartDetailsLstPkr/#Value');
        return tmp[0] !== undefined ? String(tmp[0].ReturnValue) : '';
    } catch (exception)	{
        return undefined;
    }
}
