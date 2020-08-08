package com.example.ourstatus;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
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
    private int height;
    private int width;
    private DisplayMetrics dm;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "GetUsername";
    private List<Tasks> feed;

    public void onStart(){
        dm = new DisplayMetrics();
        WindowManager windowManager = (WindowManager) this.getSystemService(WINDOW_SERVICE);
        windowManager.getDefaultDisplay().getMetrics(dm);
        height = dm.heightPixels;
        width = dm.widthPixels;
        super.onStart();
        mBinding = FeedBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        getUsername();
    }

    public void getUsername(){
        FirebaseUser currentUser = mAuth.getCurrentUser();
        String email = currentUser.getEmail();

        db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            String username;
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                Log.d(TAG, "username: Found");
                                username = document.getString("username");
                                retrieveFeed(username);
                                return;
                            }

                            Log.w(TAG, "username: Not found", task.getException());
                        } else {
                            Log.w(TAG, "username: Not found", task.getException());
                        }
                    }
                });
    }

    public void createFeed(List<Tasks> feed){
        this.feed = feed;
        final ListView listview = (ListView) findViewById(R.id.listview);
        Collections.sort(feed);
        Log.d(TAG, "height: " + height);
        final FeedAdapter adapter = new FeedAdapter(Feed.this, feed, height, width);
        listview.setAdapter(adapter);
    }

    public void retrieveFeed(String username){
        db.collection("tasks")
                .whereEqualTo("creatorUsername", username)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            List<Tasks> feed = new ArrayList<>();
                            Tasks t;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                t = document.toObject(Tasks.class);
                                if(t.getDateCompleted() != null){
                                    feed.add(document.toObject(Tasks.class));
                                }
                            }

                            if(feed.size() == 0){//runs when no tasks found
                                Log.w(TAG, "tasks: Not found", task.getException());
                            } else{
                                Log.d(TAG, "tasks: Found");
                                createFeed(feed);
                            }
                        } else {
                            Log.w(TAG, "tasks: Not found", task.getException());

                        }
                    }
                });
    }

    public void commentWindow(List<Comments> comments){
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.comment_section);
        ListView commentList = (ListView) dialog.findViewById(R.id.comments_list);
        CommentAdapter adapter = new CommentAdapter(Feed.this, comments, height, width);
        commentList.setAdapter(adapter);

        //CommentDialog dialog = new CommentDialog(Feed.this);
        //dialog.setContentView(R.layout.comment_section);
        //dialog.setTitle("Comments");
        dialog.show();
        Window window = dialog.getWindow();
        window.setLayout(width, height);
    }


    public void comment(View v){
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
                            List<Comments> comments = new ArrayList<>();
                            Comments c;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found

                                c = document.toObject(Comments.class);
                                comments.add(c);
                            }

                            if(comments.size() == 0){//runs when no tasks found
                                Log.w(TAG, "comments: Not found", task.getException());
                            } else{
                                Log.d(TAG, "comments: Found");
                                Log.d(TAG, "" + comments.size());
                                commentWindow(comments);
                            }
                        } else {
                            Log.w(TAG, "comments: Not found", task.getException());

                        }
                    }
                });
    }

    public void like(View v) {
        String finalLikes;
        ConstraintLayout parentRow = (ConstraintLayout) v.getParent();
        ListView lv = (ListView) parentRow.getParent().getParent();
        int position = lv.getPositionForView(v);
        String taskId = feed.get(position).getId();
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

}
