import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommentService } from '../comment.service';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/users/account.service';
import { Comment } from 'src/app/shared/model/comment';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit, OnDestroy {

  @Input() taskId;
  commentList: Comment[] = [];
  commentSubscription;
  accountSubscription;
  idSubscription;
  username;
  userId;
  commentText = '';
  authorIdMap = {};

  constructor(private store: Store<State>,private commentService: CommentService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.commentSubscription = this.commentService.getCommentsForTask(this.taskId).subscribe(
      (val) => {
        this.idSubscription = this.store.select(getUserId).subscribe(
          val => {
            this.userId = val;
          }
        );
        if (val.length > 0) {
          let userSet = new Set<string>();
          let comments = val;
          val.forEach(comment => {
            userSet.add(comment.authorId);
          })
          let userList = Array.from(userSet);
          this.accountSubscription = this.accountService.getAccountsByIds(userList).subscribe(
            (val) => {
              val.forEach(account => {
                this.authorIdMap[account.id] = account.username;
              });
              this.commentList = comments.sort(
                (a,b) => {
                  let a_date = new Date(a.date.seconds * 1000);
                  let b_date = new Date(b.date.seconds * 1000);
                  return a_date.valueOf() - b_date.valueOf();
                }
              );
            }
          )
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();

    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
  }

  postComment(): void {
    if (this.commentText) {
      let comment: Comment = {
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