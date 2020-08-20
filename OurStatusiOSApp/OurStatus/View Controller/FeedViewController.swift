//
//  FeedViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 8/15/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit

class FeedViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    

    var posts = [
        Post(id: "1", author: "Chris Liu", task: "Eat peaches", likes: 0),
        Post(id: "2", author: "Kevin Chen", task: "Finish an extremely long task like the longest task in existence like this task is so long that it would take a long task name to accomplish it and the even then the task wouldn't be completed", likes: 1),
        Post(id: "3", author: "Jeffrey Deng", task: "Find a large cat", likes: 0)
    ]
    @IBOutlet weak var tableView: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let cellNib = UINib(nibName: "PostTableViewCell", bundle: nil)
        tableView.register(cellNib, forCellReuseIdentifier: "postCell")
        
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 100
        
        tableView.delegate = self
        tableView.dataSource = self
        tableView.reloadData()
        
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return posts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "postCell", for: indexPath) as! PostTableViewCell
        cell.set(post: posts[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }

}
