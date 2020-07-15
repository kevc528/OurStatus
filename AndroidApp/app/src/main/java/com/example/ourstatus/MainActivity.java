package com.example.ourstatus;
//Home Page
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.DialogFragment;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.TextView;
import android.widget.TimePicker;

import com.google.firebase.auth.FirebaseAuth;
import java.util.Calendar;
import java.util.Locale;

public class MainActivity extends AppCompatActivity{

    private TextView dateText;
    private TextView timeText;
    private FirebaseAuth mAuth;
    private int month;
    private int date;
    private int year;
    private int hour;
    private int minute;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.home);
        mAuth = FirebaseAuth.getInstance();
        dateText = findViewById(R.id.dateText);
        timeText = findViewById(R.id.timeText);
        Button selectDate = findViewById(R.id.dateButton);
        Button selectTime = findViewById(R.id.timeButton);

        selectDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar calendar = Calendar.getInstance();
                month = calendar.get(Calendar.MONTH);
                date = calendar.get(Calendar.DAY_OF_MONTH);
                year = calendar.get(Calendar.YEAR);

                DatePickerDialog datePickerDialog = new DatePickerDialog(MainActivity.this,
                        new DatePickerDialog.OnDateSetListener() {
                            @Override
                            public void onDateSet(DatePicker datePicker, int year, int month, int date) {
                                String day_of_week;
                                String day_of_month;
                                Calendar c = Calendar.getInstance();
                                c.set(Calendar.DAY_OF_MONTH,date);
                                c.set(Calendar.MONTH,month);
                                c.set(Calendar.YEAR,year);

                                day_of_month = c.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                                day_of_week = c.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
                                dateText.setText(day_of_week + " " + date + ", " + day_of_month);
                            }
                        }, year, month, date);
                datePickerDialog.show();
            }
        });

        selectTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar calendar = Calendar.getInstance();
                hour = calendar.get(Calendar.HOUR_OF_DAY);
                minute = calendar.get(Calendar.MINUTE);
                TimePickerDialog timePickerDialog = new TimePickerDialog(MainActivity.this,3,
                        new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                                String am_pm = "";
                                Calendar c = Calendar.getInstance();
                                c.set(Calendar.HOUR_OF_DAY, hourOfDay);
                                c.set(Calendar.MINUTE, minute);


                                if (c.get(Calendar.AM_PM) == Calendar.AM)
                                    am_pm = "AM";
                                else if (c.get(Calendar.AM_PM) == Calendar.PM)
                                    am_pm = "PM";

                                String strHrsToShow = (c.get(Calendar.HOUR) == 0) ?"12":c.get(Calendar.HOUR)+"";

                                timeText.setText(strHrsToShow+":"+ c.get(Calendar.MINUTE)+" "+am_pm);
                            }
                        }, hour, minute, false);
                timePickerDialog.show();
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

