package com.example.ourstatus;

import android.app.Dialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.MotionEvent;
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
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

public class Feed extends AppCompatActivity {
    private FeedBinding mBinding;
    CommentAdapter commentAdapter;
    private int height, width;
    private DisplayMetrics dm;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "GetUsername";
    private List<Tasks> feed;
    private List<Comments> comments;
    private String taskId;
    private float x1, y1, x2, y2;
    private Dialog dialog;
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef = storage.getReference();
    private List<String> creatorIds;
    private HashMap<String, String[]> uMap;
    private HashMap<String, String[]> cMap;
    private List<String> friendIds;
    private List<String> firstIdFriends;
    private List<String> secondIdFriends;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = FeedBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
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
        new getFriends().execute("", "", "");
    }

    private class getFriends extends AsyncTask<String, String, String> {
        @Override
        protected String doInBackground(String... strings) {
            firstIdFriends = new ArrayList<String>();
            secondIdFriends = new ArrayList<String>();

            friendIds = new ArrayList<String>();

            db.collection("friendship")
                    .whereEqualTo("firstId", StateClass.userId)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String friendId;
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    friendId = document.getString("secondId");
                                    secondIdFriends.add(friendId);
                                }
                                friendIds.addAll(secondIdFriends);
                                secondIdFriends = null;
                                Log.w(TAG, "id: Found", task.getException());
                            } else {
                                Log.w(TAG, "id: Not found", task.getException());
                            }
                        }
                    });

            db.collection("friendship")
                    .whereEqualTo("secondId", StateClass.userId)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String friendId;
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    friendId = document.getString("firstId");
                                    firstIdFriends.add(friendId);
                                }
                                friendIds.addAll(firstIdFriends);
                                firstIdFriends = null;
                                Log.w(TAG, "id: Found", task.getException());
                            } else {
                                Log.w(TAG, "id: Not found", task.getException());
                            }
                        }
                    });

            while(firstIdFriends != null && secondIdFriends != null){
                int count = 1;
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                count++;
            }

            return "";
        }

        protected void onPostExecute(String result) {
            Log.w(TAG, friendIds.toString());
            retrieveFeed(friendIds);
        }
    }

    public void retrieveFeed(List<String> friends){
        int start, end;
        int length = friends.size();
        final int track = length / 10;
        creatorIds = new ArrayList<>();

        for (int i = 0; i <= track; i ++){
            start = i * 10;
            if(i == track){
                end = length;
            } else{
                end = i + 9;
            }
            final int finalI = i;
            Log.d(TAG, start + "  " + end);
            db.collection("tasks")
                    .whereIn("creatorId", friends.subList(start, end))
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
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
                                } else if (finalI == track){
                                    Log.d(TAG, "tasks: Found");
                                    creatorIds.add(StateClass.userId);
                                    getFeedUsernames(creatorIds);
                                }
                            } else {
                                Log.w(TAG, "tasks: error finding", task.getException());

                            }
                        }
                    });
        }

    }

    public void getFeedUsernames(List<String> creatorIds){
        int start, end;
        int length = creatorIds.size();
        final int track = length / 10;
        uMap = new HashMap<>();

        for (int i = 0; i <= track; i ++) {
            start = i * 10;
            if (i == track) {
                end = length;
            } else {
                end = i + 9;
            }
            final int finalI = i;
            Log.d(TAG, start + "  " + end);
            db.collection("users")
                    .whereIn("id", creatorIds.subList(start,end))
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String username;
                                String picture;
                                String id;
                                for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                    username = document.getString("username");
                                    id = document.getString("id");
                                    picture = document.getString("picture");
                                    uMap.put(id, new String[]{username, picture});
                                }

                                if (uMap.size() == 1) {//runs when no tasks found
                                    Log.w(TAG, "users: Not found", task.getException());
                                } else if(finalI == track){
                                    createFeed(uMap);
                                    Log.d(TAG, "users: Found");
                                }
                            } else {
                                Log.w(TAG, "users: error finding", task.getException());

                            }
                        }
                    });
        }
    }

    public void createFeed(HashMap<String, String[]> uMap){
        final ListView listview = (ListView) findViewById(R.id.listview);
        Collections.sort(feed);
        Log.d(TAG, "height: " + height);
        final FeedAdapter adapter = new FeedAdapter(Feed.this, feed, uMap ,height, width, StateClass.userId, this);
        listview.setAdapter(adapter);
        listview.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                return onTouchEvent(motionEvent);
            }
        });
    }

    public void comment(View v){
        comments = new ArrayList<>();
        ListView lv = (ListView) v.getParent().getParent().getParent();
        int position = lv.getPositionForView(v);
        taskId = feed.get(position).getId();
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
                                displayComments();
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
        int start, end;
        int length = authorIds.size();
        final int track = length / 10;
        cMap = new HashMap<>();
        for(int i = 0; i <= track; i ++){
            start = i * 10;
            if(i == track){
                end = length;
            } else{
                end = i + 9;
            }
            final int finalI = i;
            Log.d(TAG, start + "  " + end);
            db.collection("users")
                    .whereIn("id", authorIds.subList(start, end))
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String username;
                                String id;
                                String picture;
                                for (QueryDocumentSnapshot document : task.getResult()) {//runs completed tasks found
                                    username = document.getString("username");
                                    id = document.getString("id");
                                    picture = document.getString("picture");
                                    cMap.put(id, new String[]{username, picture});
                                }
                                if(finalI == track){
                                    displayComments();
                                }
                                Log.d(TAG, "Comments found");
                            } else {
                                Log.w(TAG, "users: error finding", task.getException());

                            }
                        }
                    });
        }

    }

    public void displayComments(){
        dialog = new Dialog(this);
        dialog.setContentView(R.layout.comment_section);
        ListView commentList = (ListView) dialog.findViewById(R.id.comments_list);

        if(cMap != null){
            Collections.sort(comments);
            commentAdapter = new CommentAdapter(Feed.this, comments, cMap, height, width, this);
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
            taskRef.update("likedUsers", FieldValue.arrayUnion(StateClass.userId));
        } else{
            i.clearColorFilter();
            likes -= 1;
            taskRef.update("likedUsers", FieldValue.arrayRemove(StateClass.userId));
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
        Comments comment = new Comments(StateClass.userId,commentText.getText().toString(), taskId, Timestamp.now());
        comments.add(comment);
        cMap.put(StateClass.userId, new String[]{StateClass.username, StateClass.profile});
        Log.w(TAG, comments.toString());
        Log.w(TAG, cMap.toString());
        commentAdapter.notifyDataSetChanged();
        commentText.setText("");
        DocumentReference ref = db.collection("comments").document();
        ref.set(comment);
    }

    public boolean onTouchEvent(MotionEvent touchEvent){
        switch(touchEvent.getAction()){
            case MotionEvent.ACTION_DOWN:
                x1 = touchEvent.getX();
                y1 = touchEvent.getY();
                break;
            case MotionEvent.ACTION_UP:
                x2 = touchEvent.getX();
                y2 = touchEvent.getY();
                if(x1 < x2){//Swipe left
                    Intent i = new Intent(Feed.this, MainActivity.class);
                    startActivity(i);
                }
                break;
        }
        return false;
    }


    public void exit(View v){
        dialog.dismiss();
    }
}
