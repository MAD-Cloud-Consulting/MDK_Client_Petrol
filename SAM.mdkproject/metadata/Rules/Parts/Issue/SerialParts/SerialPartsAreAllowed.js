export default function SerialPartsAreAllowed(context) {
   return context.binding.SerialNoProfile === '' ? false : true;
}
