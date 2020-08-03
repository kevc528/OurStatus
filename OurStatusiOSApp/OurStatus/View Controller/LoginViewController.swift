//
//  LoginViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/8/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit
import FirebaseAuth
import Firebase

class LoginViewController: UIViewController {

    @IBOutlet weak var usernameTextField: UITextField!
    
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var loginButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    @IBAction func loginTapped(_ sender: Any) {
        // Validate Text Fields
        
        //Create cleaned versions of text field
        let username = usernameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        let password = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        let db = Firestore.firestore()
        db.collection("users").whereField("username", isEqualTo: username)
            .getDocuments() { (querySnapshot, err) in
                if err != nil {
                    self.showAlert(title: "No user with the username " + username + " found", message: "Please make sure that the username entered is correct")
                } else {
                    let documents = querySnapshot!.documents
                    if documents.count == 0 {
                        self.showAlert(title: "No user with the username " + username + " found", message: "Please make sure that the username entered is correct")
                    }
                    else {
                        let email = querySnapshot!.documents[0].get("email") as! String
                        //Signing in the user
                        if email == "" {
                            self.showAlert(title: "No email found for " + username, message: "Please make sure the user has a valid email")
                        }
                        Auth.auth().signIn(withEmail: email, password: password) {
                            (result, error) in
                            if error != nil {
                                self.showAlert(title: "Incorrect Password", message: "Please make sure the password entered is correct")
                            }
                            else {
                                self.transitionToHome()
                            }
                        }
                    }
                }
        }
    }
    
    func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Try Again", style: .cancel, handler: {
            action in print("tapped Dismiss")
        }))
        present(alert, animated: true)
    }
    
    func transitionToHome() {
        let homeViewController = storyboard?.instantiateViewController(identifier: Constants.Storyboard.taskCreatorViewController) as? HomeViewController
        
        view.window?.rootViewController = homeViewController
        view.window?.makeKeyAndVisible()
    }
}
