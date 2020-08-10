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

import androidx.constraintlayout.widget.ConstraintLayout;

import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.List;

public class CommentAdapter extends ArrayAdapter<Comments> {
    private HashMap<String, String> uMap;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private List<Comments> comments;
    private final Context context;
    private ConstraintLayout.LayoutParams param;
    private static final String TAG = "GetUsername";

    public CommentAdapter(Context context, List<Comments> comments, HashMap<String, String> uMap, int height, int width) {
        super(context, -1, comments);
        this.context = context;
        this.comments= comments;
        this.uMap = uMap;
        param = new ConstraintLayout.LayoutParams(width, (int) ((int) height * .11));
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.comment, parent, false);
        Comments comment = comments.get(position);
        String commentString = comment.getContent();
        String creatorId = comment.getAuthorId();
        String username = uMap.get(creatorId);
        int usernameLength = username.length();

        rowView.setLayoutParams(param);

        SpannableStringBuilder str = new SpannableStringBuilder(username + " " + commentString);
        str.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, usernameLength, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        TextView commentText = (TextView) rowView.findViewById(R.id.comment_text);
        Log.w(TAG, username + commentString);
        commentText.setText(str);
        return rowView;
    }
}
