//
//  AlertFactory.swift
//  IssueTrackerApp
//
//  Created by 서명렬 on 2020/11/10.
//

import UIKit

class AlertFactory {
  static let shared = AlertFactory()
  
  func makeActionSheet(viewControllerToPresent viewController: UIViewController, handler: @escaping (() -> ())) {
    let actionSheet = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
    let action = UIAlertAction(title: "Discard Change", style: .destructive) { (action) in
      handler()
    }
    let cancel = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
    actionSheet.addAction(action)
    actionSheet.addAction(cancel)
    
    viewController.present(actionSheet, animated: true, completion: nil)
  }
  
  func makeAlert(viewControllerToPresent viewController: UIViewController, message: String) {
    let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
    let action = UIAlertAction(title: nil, style: .default, handler: nil)
    
    alert.addAction(action)
    viewController.present(alert, animated: true, completion: nil)
  }
}
