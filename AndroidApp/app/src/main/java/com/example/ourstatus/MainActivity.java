package com.example.ourstatus;
//Home Page
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.DialogFragment;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public class MainActivity extends AppCompatActivity{

    private TextView dateText;
    private FirebaseAuth mAuth;
    private Button selectDate;
    private Calendar calendar = Calendar.getInstance();
    private int month;
    private int date;
    private int year;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.home);
        mAuth = FirebaseAuth.getInstance();
        dateText = findViewById(R.id.dateText);
        selectDate = findViewById(R.id.dateButton);

        selectDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                calendar = Calendar.getInstance();
                month = calendar.get(Calendar.MONTH);
                date = calendar.get(Calendar.DAY_OF_MONTH);
                year = calendar.get(Calendar.YEAR);
                DatePickerDialog datePickerDialog = new DatePickerDialog(MainActivity.this,
                        new DatePickerDialog.OnDateSetListener() {
                            @Override
                            public void onDateSet(DatePicker datePicker, int year, int month, int date) {
                                String day_of_week;
                                String day_of_month;

                                calendar.set(Calendar.DAY_OF_MONTH,date);
                                calendar.set(Calendar.MONTH,month);
                                calendar.set(Calendar.YEAR,year);

                                day_of_month = calendar.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                                day_of_week = calendar.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
                                dateText.setText(day_of_week + " " + date + ", " + day_of_month);
                            }
                        }, year, month, date);
                datePickerDialog.show();
            }
        });

    }



    public void onClick(View v) {
        int i = v.getId();

        if(i == R.id.dateButton){
            //showDatePickerDialog(v);
        }else{
            mAuth.signOut();
            setContentView(R.layout.create_account);
        }
    }

}

