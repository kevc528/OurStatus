package com.example.ourstatus;

import android.content.Context;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.HashMap;
import java.util.List;

public class FeedAdapter extends ArrayAdapter<Tasks> {
    private List<Tasks> feed;
    private HashMap<String, String> uMap;
    private final Context context;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private ConstraintLayout.LayoutParams param;
    private static final String TAG = "GetUsername";


    public FeedAdapter(Context context, List<Tasks> feed, HashMap<String, String> uMap, int height, int width) {
        super(context, -1, feed);
        this.context = context;
        this.feed = feed;
        this.uMap = uMap;

        param = new ConstraintLayout.LayoutParams(width, (int) ((int) height * .15));
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.feed_task, parent, false);
        Tasks task = feed.get(position);
        String taskTitle = task.getTitle();
        String creatorId = task.getCreatorId();
        String likes = Integer.toString(task.getLikes());
        String username = uMap.get(creatorId);
        int usernameLength = username.length();

        if(taskTitle.length() > 55){
            taskTitle = taskTitle.substring(0, 55) + "...";
        }
        rowView.setLayoutParams(param);

        SpannableStringBuilder str = new SpannableStringBuilder(username + " Completed Task:");
        str.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, usernameLength, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        TextView likeCount = (TextView) rowView.findViewById(R.id.like_count);
        TextView completedUser= (TextView) rowView.findViewById(R.id.completed_user);
        TextView taskName = (TextView) rowView.findViewById(R.id.task_name);


        completedUser.setText(str);
        taskName.setText(taskTitle);
        likeCount.setText(likes);

        return rowView;
    }

}