//
//  PostTableViewCell.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 8/15/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit

class PostTableViewCell: UITableViewCell {
    
    var liked = false
    
    @IBAction func likeButtonAction(_ sender: Any) {
        let unliked = #imageLiteral(resourceName: "Unfilled Heart")
        let likedImage = #imageLiteral(resourceName: "Filled Heart")
        let prevLikes = Int32(likesNumber.text!)
        if (!self.liked) {
            self.liked = true
            likesNumber.text = String(prevLikes! + 1)
            likeButton.setImage(likedImage, for: .normal)
        } else {
            self.liked = false
            likesNumber.text = String(prevLikes! - 1)
            likeButton.setImage(unliked, for: .normal)
        }
    }
    @IBAction func commentButtonAction(_ sender: Any) {
    }
    @IBOutlet weak var likeButton: UIButton!
    @IBOutlet weak var commentButton: UIButton!
    @IBOutlet weak var usernameCompletedLabel: UILabel!
    @IBOutlet weak var taskLabel: UILabel!
    @IBOutlet weak var likesNumber: UILabel!
    @IBOutlet weak var profileImageView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.liked = false
        profileImageView.layer.cornerRadius = profileImageView.bounds.height / 2
        profileImageView.clipsToBounds = true
        
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func set(post:Post) {
        usernameCompletedLabel.text = post.author + " Completed Task:"
        taskLabel.text = post.task
        likesNumber.text = String(post.likes)
    }
    
}
