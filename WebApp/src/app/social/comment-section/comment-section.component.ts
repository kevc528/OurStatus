import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommentService } from '../comment.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() taskId;
  @Output() backToFeed = new EventEmitter<any>();
  @ViewChild('commentContainer') commentContainer: ElementRef;
  commentList;
  commentSubscription;
  username;
  scrollDown=0;
  commentText = '';

  constructor(private commentService: CommentService, private cookieService: CookieService) { }

  scrollBottom() {
    this.scrollDown = this.commentContainer.nativeElement.scrollHeight;
    console.log(this.scrollDown);
  }

  ngOnInit(): void {
    this.commentSubscription = this.commentService.getCommentsForTask(this.taskId).subscribe(
      (val) => {
        this.commentList = val.sort(
          (a,b) => {
            let a_date = new Date(a.date.seconds * 1000);
            let b_date = new Date(b.date.seconds * 1000);
            return a_date.valueOf() - b_date.valueOf();
          }
        );
        this.scrollBottom();
      }
    )
    this.username = this.cookieService.get('user');
  }

  ngAfterViewInit(): void {
    this.scrollBottom();
  }

  onBackClick(): void {
    this.backToFeed.emit();
  }

  ngOnDestroy(): void {
    this.commentSubscription.unsubscribe();
  }

  postComment(): void {
    if (this.commentText) {
      let comment = {
        author: this.username,
        content: this.commentText,
        date: new Date(),
        taskId: this.taskId
      };
      this.commentService.addComment(comment).then(
        (val) => {
          this.commentText = '';
          this.scrollBottom();
        }
      );
    }
  }

}