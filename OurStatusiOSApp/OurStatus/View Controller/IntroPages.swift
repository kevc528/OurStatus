//
//  IntroPages.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 8/7/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//
import UIKit

class IntroPages: UIPageViewController, UIPageViewControllerDataSource, UIPageViewControllerDelegate {

    var pages = [UIViewController]()

    override func viewDidLoad() {
        super.viewDidLoad()
        self.delegate = self
        self.dataSource = self

        let p1: UIViewController! = storyboard?.instantiateViewController(withIdentifier: Constants.Storyboard.feedViewController)
        let p2: UIViewController! = storyboard?.instantiateViewController(withIdentifier:  Constants.Storyboard.taskViewController)
        let p3: UIViewController! = storyboard?.instantiateViewController(withIdentifier: Constants.Storyboard.profileViewController)
        // etc ...

        pages.append(p1)
        pages.append(p2)
        pages.append(p3)

        // etc ...
        setViewControllers([p2], direction: UIPageViewController.NavigationDirection.forward, animated: false, completion: nil)
    }

    func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController)-> UIViewController? {
       
        let cur = pages.firstIndex(of: viewController)!

        // if you prefer to NOT scroll circularly, simply add here:
        if cur == 0 { return nil }

        var prev = (cur - 1) % pages.count
        if prev < 0 {
            prev = pages.count - 1
        }
        return pages[prev]
    }

    func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController)-> UIViewController? {
         
        let cur = pages.firstIndex(of: viewController)!

        // if you prefer to NOT scroll circularly, simply add here:
        if cur == (pages.count - 1) { return nil }

        let nxt = abs((cur + 1) % pages.count)
        return pages[nxt]
    }

    func presentationIndex(for pageViewController: UIPageViewController)-> Int {
        return pages.count
    }
}
