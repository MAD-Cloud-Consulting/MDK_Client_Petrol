//
//  HierarchyDelegate.h
//  HierarchyFramework
//
//  Created by Mehta, Kunal on 3/28/19.
//  Copyright © 2019 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 Dummy delegate class, meant for compilation
 */
@interface HierarchyDelegate : NSObject
-(void) getObjects: (NSDictionary *) dictionary type: (NSString *) type;
-(void) loadMoreItems: (NSDictionary *) dictionary pageDictionary: (NSDictionary *) pageDetails;
-(void) searchUpdated: (NSDictionary *) dictionary pageDictionary: (NSDictionary *) searchString;
-(void) updateReturnValues: (NSArray *) ids;
-(NSString *) getLocalizedValue: (NSString *) dictionary type: (NSArray *) type;

@end
