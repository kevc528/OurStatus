package com.example.ourstatus;

import android.content.Context;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.view.LayoutInflater;

import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;


import java.util.HashMap;
import java.util.List;

public class FeedAdapter extends ArrayAdapter<Tasks>{
    private List<Tasks> tasks;
    private HashMap<String, String[]> uMap;
    private final Context context;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private ConstraintLayout.LayoutParams param;
    private static final String TAG = "GetUsername";
    private String user;
    private FeedFragment feed;
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef = storage.getReference();


    public FeedAdapter(Context context, List<Tasks> tasks, HashMap<String, String[]> uMap, int height, int width, String user, FeedFragment feed) {
        super(context, -1, tasks);
        this.context = context;
        this.tasks = tasks;
        this.uMap = uMap;
        this.user = user;
        this.feed = feed;

        param = new ConstraintLayout.LayoutParams(width, (int) ((int) height * .15));
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.feed_task, parent, false);
        ImageView i = rowView.findViewById(R.id.like);
        Tasks task = tasks.get(position);
        String taskTitle = task.getTitle();
        String creatorId = task.getCreatorId();
        String likes = Integer.toString(task.getLikes());
        String username = uMap.get(creatorId)[0];
        String picture = uMap.get(creatorId)[1];
        List<String> likedUsers = task.getLikedUsers();
        int usernameLength = username.length();

        StorageReference storageReference = storageRef.child(picture);
        ImageView profilePicture = (ImageView) rowView.findViewById(R.id.profile_image);
        GlideApp.with(context)
                .load(storageReference)
                .into(profilePicture);

        if(taskTitle.length() > 55){
            taskTitle = taskTitle.substring(0, 55) + "...";
        }



        if(likedUsers.contains(user)){
            i.setColorFilter(R.color.purple);
        }

        rowView.setLayoutParams(param);

        SpannableStringBuilder str = new SpannableStringBuilder(username + " Completed Task:");
        str.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, usernameLength, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        TextView likeCount = (TextView) rowView.findViewById(R.id.like_count);
        TextView completedUser= (TextView) rowView.findViewById(R.id.completed_user);
        TextView taskName = (TextView) rowView.findViewById(R.id.task_name);
        ImageView comments = (ImageView) rowView.findViewById(R.id.comment_button);



        completedUser.setText(str);
        taskName.setText(taskTitle);
        likeCount.setText(likes);
        rowView.setOnClickListener(null);

        i.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                feed.like(view);
            }
        });

        comments.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                feed.comment(view);
            }
        });


        return rowView;
    }

}