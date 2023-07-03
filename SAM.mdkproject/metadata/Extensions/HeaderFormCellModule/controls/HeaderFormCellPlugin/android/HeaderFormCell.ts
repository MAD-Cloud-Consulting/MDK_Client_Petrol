import { View, Utils, Device } from '@nativescript/core';
/*
  This is a way to keep iOS and Android implementation of your extension separate
  We will encapsulate the ButtonStack class definition inside a function called GetButtonStackClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetButtonStackClass
*/
declare var com: any;
declare var android: any;
export function GetButtonStackClass() {
  /**
   * IMPLEMENT THE ANDROID VERSION OF YOUR PLUGIN HERE
   * In this sample you have 2 controls a label and a seekbar (slider)
   * You extends this control with Observable (View) class so that you can accept listeners
   *  and notify them when UI interaction is triggered
   */
  function getPadding() {
    // Return left & right padding in dp
    // For tablet you want 24dp, for other type you use 16dp
    return Device.deviceType === 'Tablet' ? 24 : 16;
  }

  class HeaderFormCell extends View {
    private _androidcontext;
    private _layout;
    private _label;

    public constructor(context: any) {
      super();
      this._androidcontext = context;
      this.createNativeView();
    }

    /**
     * Creates new native controls.
     */
    public createNativeView(): Object {
      //Create a LinearLayout container to contain the label and seekbar
      this._layout = new android.widget.LinearLayout(this._androidcontext);

      if (Device.deviceType === 'Tablet') {
        this._layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        this._layout.setGravity(android.view.Gravity.CENTER_VERTICAL);
      } else {
        this._layout.setOrientation(android.widget.LinearLayout.VERTICAL);
        this._layout.setGravity(android.view.Gravity.RIGHT | android.view.Gravity.CENTER_VERTICAL);
      }

      this._layout.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
        android.widget.LinearLayout.LayoutParams.MATCH_PARENT));

      const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(getPadding()));
      const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(0)); // For top & bottom padding, always 16dp
      this._layout.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);

      // Create the text label

      let textLabel = new android.widget.TextView(this._androidcontext);
      textLabel.setLetterSpacing(0.09);
      textLabel.setAllCaps(true);
      (<any>textLabel).owner = this;
      this._layout.addView(textLabel);
      this._label = textLabel;

      this.setNativeView(this._layout);
      return this._layout;
    }

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
        // Attach the owner to nativeView.
        // When nativeView is tapped you get the owning JS object through this field.
        (<any>this._layout).owner = this;
        super.initNativeView();
    }

    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state
     * so that it could be reused later.
     */
    disposeNativeView(): void {
      // Remove reference from native view to this instance.

      (<any>this._layout).owner = null;
      (<any>this._label).owner = null;

      // If you want to recycle nativeView and have modified the nativeView
      // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
      // you have to reset it to its initial state here.
    }

    public getView(): any {
      return this._layout;
    }

    public getTitle(name: string): boolean {
      return this._label.getText();
    }

    public setTitle(title: string) {
      this._label.setText(title);
    }
  }
  return HeaderFormCell;
}
