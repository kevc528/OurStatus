package com.example.ourstatus;

import android.content.Context;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import org.w3c.dom.Text;

import java.util.HashMap;
import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class FeedAdapter extends ArrayAdapter<Tasks> {
    private List<Tasks> feed;
    private final Context context;
    private ConstraintLayout.LayoutParams param;
    private static final String TAG = "GetUsername";
    private int width;


    public FeedAdapter(Context context, List<Tasks> feed, int height, int width) {
        super(context, -1, feed);
        this.context = context;
        this.feed = feed;

        param = new ConstraintLayout.LayoutParams(width, (int) ((int) height * .15));
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.feed_task, parent, false);
        Tasks task = feed.get(position);
        String taskId = task.getId();
        String taskTitle = task.getTitle();
        String username = task.getCreatorUsername();
        String likes = Integer.toString(task.getLikes());
        int usernameLength = username.length();

        if(taskTitle.length() > 20){
            taskTitle = taskTitle.substring(0,20) + "...";
        }

        rowView.setLayoutParams(param);

        SpannableStringBuilder str = new SpannableStringBuilder(username + " Completed Task:");
        str.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, usernameLength, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        TextView likeCount = (TextView) rowView.findViewById(R.id.like_count);
        TextView completedUser= (TextView) rowView.findViewById(R.id.completed_user);
        TextView taskName = (TextView) rowView.findViewById(R.id.task_name);
        TextView taskIdView = (TextView) rowView.findViewById(R.id.task_id);


        completedUser.setText(str);
        taskName.setText(taskTitle);
        likeCount.setText(likes);
        taskIdView.setText(taskId);

        return rowView;
    }

}