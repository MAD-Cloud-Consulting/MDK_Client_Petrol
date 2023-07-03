import { View, Utils, Device, Application } from '@nativescript/core';
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

  class ButtonStack extends View {
    private _androidcontext;
    private _layout;
    private _data = [];
    private _buttons = [];
    // color styles for light and dark themes
    static readonly ACTIVE_BUTTON_COLOR = 0xff0a6ed1;
    static readonly ACTIVE_BUTTON_COLOR_DARK = 0xff91c8f6;
    static readonly INACTIVE_BUTTON_COLOR = 0x7f0a6ed1;
    static readonly INACTIVE_BUTTON_COLOR_DARK = 0x7f91c8f6;
    // transparent mask
    static readonly TRANSPARENT_BACKGROUND = 0x00000000;

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
        this._layout.setGravity(android.view.Gravity.LEFT | android.view.Gravity.CENTER_VERTICAL);
      }

      this._layout.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
        android.widget.LinearLayout.LayoutParams.MATCH_PARENT));

      const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(getPadding()));
      const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(0)); // For top & bottom padding, always 16dp
      this._layout.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);
      
      this.setNativeView(this._layout);
      return this._layout;
    }

    private createButton(title: string, isEditable: boolean): android.widget.Button {
      let btn = new com.sap.cloud.mobile.fiori.formcell.ButtonFormCell(this._androidcontext);

      let lp = new android.widget.LinearLayout.LayoutParams(
                              android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, 100); // TODO: Workaround for SDK bug with height
                              //android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
      lp.setMargins(0, 0, Utils.layout.round(Utils.layout.toDevicePixels(getPadding())), 0);
      btn.setLayoutParams(lp);
      btn.setText(title);
      btn.setBackgroundColor(ButtonStack.TRANSPARENT_BACKGROUND);
      btn.setTextColor(this.getButtonColor(isEditable));
      btn.setEditable(isEditable);
      return btn;
    }

    private getDataForButton(button: any): any {
      for (let index = 0; index < this._buttons.length; index++) {
        const element = this._buttons[index];
        if(button == element) {
          return this._data[index];
        }
      }
      return null;
    }

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
      console.log("initNativeView called");
        // Attach the owner to nativeView.
        // When nativeView is tapped you get the owning JS object through this field.
        (<any>this._layout).owner = this;
        super.initNativeView();
    }

    //Must return the native view of the control for MDK FormCell and Section Extension
    public addButton(data: any) {
      if (data) {
        this._data.push(data);
        let b = this.createButton(data.Title, data.IsEditable);
        this._buttons.push(b);
        (<any>b).owner = this;

        // click listener
        b.setOnClickListener(new android.view.View.OnClickListener({
          onClick(button: any) {
            // Perform action on click
            var eventData = {
              eventName: "OnMyButtonClick",
              object: button.owner,
              value: button.owner.getDataForButton(button)
            };
            button.owner.notify(eventData);
          }
        }));

        this._layout.addView(b);
      }
    }

    public getView(): any {
      return this._layout;
    }

    public isEditable(name: string): boolean {
      return this.getButtonByName(name).isEditable();
    }

    public setEditable(name: string, isEditable: boolean) {
      this.getButtonByName(name).setTextColor(this.getButtonColor(isEditable));
      return this.getButtonByName(name).setEditable(isEditable);
    }
    
    public getTitle(name: string): boolean {
      return this.getButtonByName(name).Title;
    }

    public setTitle(name: string, title: string) {
      let button = this.getButtonByName(name);
      if (button) {
        button.setText(title);
      }
    }

    private getButtonByName(name: string): any {
      for (let index = 0; index < this._data.length; index++) {
        const element = this._data[index];
        if(element._Name == name) {
          return this._buttons[index];
        }
      }
      return null;
    }

    private getButtonColor(isEditable: boolean): any {
      if (Application.systemAppearance() === 'dark') {
        return isEditable ? ButtonStack.ACTIVE_BUTTON_COLOR_DARK : ButtonStack.INACTIVE_BUTTON_COLOR_DARK;
      }
      return isEditable ? ButtonStack.ACTIVE_BUTTON_COLOR : ButtonStack.INACTIVE_BUTTON_COLOR;
    }
  
    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state
     * so that it could be reused later.
     */
    disposeNativeView(): void {
      // Remove reference from native view to this instance.
      this._buttons.forEach(element => {
        (<any>element).owner = null;
      });
      (<any>this._layout).owner = null;

      // If you want to recycle nativeView and have modified the nativeView
      // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
      // you have to reset it to its initial state here.
    }
  }
  return ButtonStack;
}
