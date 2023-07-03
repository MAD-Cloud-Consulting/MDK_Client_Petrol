
import CountTitle from '../ListView/ConfirmationsCountTitle';

export default function OnReturning(context) {
   let caption = CountTitle();
   context.setCaption(caption);
   return;
}
