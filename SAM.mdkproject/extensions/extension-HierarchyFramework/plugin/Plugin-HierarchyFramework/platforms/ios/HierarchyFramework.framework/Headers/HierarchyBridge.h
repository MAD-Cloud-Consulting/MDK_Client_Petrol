//
//  HierarchyBridge.h
//  HierarchyFramework
//
//  Created by Mehta, Kunal on 3/28/19.
//  Copyright © 2019 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "HierarchyDelegate.h"

/**
 Callback to be called from SEAM plugin.
 
 @param data data returned in callback
 @param type Corresponding request type
 */
typedef void (^HierarchyBridgeCallback)(NSDictionary* data, NSString* type);

@interface HierarchyBridge : NSObject
@property (nonatomic, copy) HierarchyBridgeCallback callback;
-(UIViewController*) createWithParams:(NSDictionary*)params andDelegate:(HierarchyDelegate*)delegate;

@end
