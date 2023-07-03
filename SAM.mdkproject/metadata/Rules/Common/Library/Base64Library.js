/*
 * Convert A String to Base64 String or Vice-Versa  
 */


export default class {
    /*
     * Convert A String to Base64 String  
    */
   //eslint-disable
    static transformStringToBase64(isAndroid, textString) {
        // eslint-disable-next-line no-undef
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          const text = new java.lang.String(textString);
          const data = text.getBytes('UTF-8');
          // eslint-disable-next-line no-undef
          const base64String = android.util.Base64.encodeToString(data,android.util.Base64.DEFAULT);
          return base64String;
        } else  {
          // eslint-disable-next-line no-undef
          const text = NSString.stringWithString(textString);
          // eslint-disable-next-line no-undef
          const data = text.dataUsingEncoding(NSUTF8StringEncoding);
          // eslint-disable-next-line no-undef
          const base64String = data.base64EncodedStringWithOptions(0);
          return base64String;
        }
      }
      
      /*
       * Convert A Base64 String to String  
       */
       static transformBase64ToString(isAndroid, base64String) {
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          var data = android.util.Base64.decode(base64String,android.util.Base64.DEFAULT);
          // eslint-disable-next-line no-undef
          var decodedString = new java.lang.String(data,java.nio.charset.StandardCharsets.UTF_8);
          return decodedString;
        } else {
          // eslint-disable-next-line no-undef
          const decodedData = NSData.alloc().initWithBase64EncodedStringOptions(base64String,0);
          // eslint-disable-next-line no-undef
          return NSString.alloc().initWithDataEncoding(decodedData,NSUTF8StringEncoding);
        }
      }
      
      static transformBinaryToBase64(isAndroid, binarySource) {
        if (isAndroid) {
          // eslint-disable-next-line no-undef
          return android.util.Base64.encodeToString(binarySource, android.util.Base64.NO_WRAP);
        } else {
          return binarySource.base64EncodedStringWithOptions(0);
        }
      }
    //eslint-enable
}
