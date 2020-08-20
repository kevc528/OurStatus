//
//  Post.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 8/17/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import Foundation
import UIKit

class Post {
    
    var id:String
    var author:String
    var task:String
    var likes:Int32
    
    init(id:String, author:String, task:String, likes:Int32) {
        self.id = id
        self.author = author
        self.task = task
        self.likes = likes
    }
}
