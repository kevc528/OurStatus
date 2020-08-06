import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommentService } from '../comment.service';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit, OnDestroy {

  @Input() taskId;
  @ViewChild('commentContainer') commentContainer: ElementRef;
  commentList;
  commentSubscription;
  username;
  userId;
  commentText = '';
  authorIdMap = {};

  constructor(private commentService: CommentService, private cookieService: CookieService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.commentSubscription = this.commentService.getCommentsForTask(this.taskId).subscribe(
      (val) => {
        val.forEach(
          comment => {
            if (this.authorIdMap.hasOwnProperty(comment.authorId)) {
              comment['author'] = this.authorIdMap[comment.authorId];
            } else {
              let subscription = this.accountService.getAccountFromId(comment.authorId).subscribe(
                (res) => {
                  comment['author'] = res.username;
                  this.authorIdMap[comment.authorId] = res.username;
                  subscription.unsubscribe();
                }
              )
            }
          }
        )
        this.commentList = val.sort(
          (a,b) => {
            let a_date = new Date(a.date.seconds * 1000);
            let b_date = new Date(b.date.seconds * 1000);
            return a_date.valueOf() - b_date.valueOf();
          }
        );
      }
    )
    this.username = this.cookieService.get('user');
    this.userId = this.cookieService.get('id');
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();
  }

  postComment(): void {
    if (this.commentText) {
      let comment = {
        authorId: this.userId,
        content: this.commentText,
        date: new Date(),
        taskId: this.taskId
      };
      this.commentService.addComment(comment).then(
        (val) => {
          this.commentText = '';
        }
      );
    }
  }

}