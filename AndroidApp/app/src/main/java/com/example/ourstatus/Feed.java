package com.example.ourstatus;

import android.app.Dialog;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.example.ourstatus.databinding.FeedBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class Feed extends AppCompatActivity {
    private FeedBinding mBinding;
    CommentAdapter commentAdapter;
    private int height;
    private int width;
    private DisplayMetrics dm;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "GetUsername";
    private List<Tasks> feed;
    private List<Comments> comments;
    private String userId, taskId;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = FeedBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        this.userId = getIntent().getStringExtra("userId");
        Log.w(TAG, userId);
    }
    public void onStart(){
        super.onStart();

        feed = new ArrayList<>();
        dm = new DisplayMetrics();
        WindowManager windowManager = (WindowManager) this.getSystemService(WINDOW_SERVICE);
        windowManager.getDefaultDisplay().getMetrics(dm);
        height = dm.heightPixels;
        width = dm.widthPixels;

        mAuth = FirebaseAuth.getInstance();
        getFriendIds();
    }

    public void getFriendIds(){
        FirebaseUser currentUser = mAuth.getCurrentUser();
        String email = currentUser.getEmail();

        db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            List<String> friends;
                            User u;
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                Log.d(TAG, "id: Found");
                                u = document.toObject(User.class);
                                friends = u.getFriends();
                                retrieveFeed(friends);
                                return;
                            }

                            Log.w(TAG, "id: Not found", task.getException());
                        } else {
                            Log.w(TAG, "id: Not found", task.getException());
                        }
                    }
                });
    }

    public void retrieveFeed(List<String> friends){
        db.collection("tasks")
                .whereIn("creatorId", friends)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            List<String> creatorIds = new ArrayList<>();
                            Tasks t;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                t = document.toObject(Tasks.class);
                                if(t.getDateCompleted() != null){
                                    feed.add(t);
                                    creatorIds.add(t.getCreatorId());
                                }
                            }

                            if(feed.size() == 0){//runs when no tasks found
                                Log.w(TAG, "tasks: Not found", task.getException());
                            } else{
                                Log.d(TAG, "tasks: Found");
                                creatorIds.add(userId);
                                getFeedUsernames(creatorIds);
                            }
                        } else {
                            Log.w(TAG, "tasks: error finding", task.getException());

                        }
                    }
                });
    }

    public void getFeedUsernames(List<String> creatorIds){
        db.collection("users")
                .whereIn("id", creatorIds)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            HashMap<String, String> uMap = new HashMap<>();
                            String username;
                            String id;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                username = document.getString("username");
                                id = document.getString("id");
                                uMap.put(id, username);
                            }

                            if(uMap.size() == 1){//runs when no tasks found
                                Log.w(TAG, "users: Not found", task.getException());
                            } else{
                                createFeed(uMap);
                                Log.d(TAG, "users: Found");
                            }
                        } else {
                            Log.w(TAG, "users: error finding", task.getException());

                        }
                    }
                });
    }

    public void createFeed(HashMap<String, String> map){
        final ListView listview = (ListView) findViewById(R.id.listview);
        Collections.sort(feed);
        Log.d(TAG, "height: " + height);
        final FeedAdapter adapter = new FeedAdapter(Feed.this, feed, map ,height, width);
        listview.setAdapter(adapter);
    }

    public void comment(View v){
        comments = new ArrayList<>();
        ListView lv = (ListView) v.getParent().getParent().getParent();
        int position = lv.getPositionForView(v);
        String taskId = feed.get(position).getId();
        db.collection("comments")
                .whereEqualTo("taskId", taskId)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            Comments c;
                            List<String> authorIds = new ArrayList<>();
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                c = document.toObject(Comments.class);
                                comments.add(c);
                                authorIds.add(c.getAuthorId());
                            }

                            if(comments.size() == 0){//runs when no tasks found
                                Log.w(TAG, "comments: No comments", task.getException());
                                displayComments(null);
                            } else{
                                Log.d(TAG, "comments: Found");
                                Log.d(TAG, "" + comments.size());
                                getCommentIds(authorIds);
                            }
                        } else {
                            Log.w(TAG, "comments: Not found", task.getException());

                        }
                    }
                });
    }

    public void getCommentIds(List<String> authorIds){
        db.collection("users")
                .whereIn("id", authorIds)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            HashMap<String, String> uMap = new HashMap<>();
                            String username;
                            String id;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                username = document.getString("username");
                                id = document.getString("id");
                                uMap.put(id, username);
                            }

                            if(uMap.size() == 0){//runs when no tasks found
                                Log.w(TAG, "users: Not found", task.getException());
                            } else{
                                displayComments(uMap);
                                Log.d(TAG, "users: Found");
                            }
                        } else {
                            Log.w(TAG, "users: error finding", task.getException());

                        }
                    }
                });
    }

    public void displayComments(HashMap<String, String> uMap){
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.comment_section);
        ListView commentList = (ListView) dialog.findViewById(R.id.comments_list);

        if(uMap != null){
            Collections.sort(comments);
            commentAdapter = new CommentAdapter(Feed.this, comments, uMap, height, width);
            commentList.setAdapter(commentAdapter);
        }


        dialog.show();
        Window window = dialog.getWindow();
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        window.setLayout(width, (int) (height * .9));
    }

    public void like(View v) {
        String finalLikes;
        ConstraintLayout parentRow = (ConstraintLayout) v.getParent();
        ListView lv = (ListView) parentRow.getParent().getParent();
        int position = lv.getPositionForView(v);
        taskId = feed.get(position).getId();
        DocumentReference taskRef = db.collection("tasks").document(taskId);
        ImageView i = (ImageView) v;
        TextView likeCount = (TextView) parentRow.findViewById(R.id.like_count);
        int likes = Integer.parseInt(likeCount.getText().toString());

        if(i.getColorFilter() == null) {
            i.setColorFilter(R.color.purple);
            likes += 1;
        } else{
            i.clearColorFilter();
            likes -= 1;
        }

        finalLikes = Integer.toString(likes);
        likeCount.setText(finalLikes);
        taskRef
                .update("likes", likes)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d(TAG, "likes updated");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "likes not updated", e);
                    }
                });


    }

    public void submitComment(View v) {
        ConstraintLayout parentRow = (ConstraintLayout) v.getParent();
        EditText commentText = (EditText) parentRow.getViewById(R.id.comment_input);
        String strComment = commentText.getText().toString();
        if(TextUtils.isEmpty(strComment)){
            return;
        }
        Comments comment = new Comments(userId,commentText.getText().toString(), taskId, Timestamp.now());
        comments.add(comment);
        commentAdapter.notifyDataSetChanged();
        commentText.setText("");
        DocumentReference ref = db.collection("comments").document();
        ref.set(comment);
    }
}
