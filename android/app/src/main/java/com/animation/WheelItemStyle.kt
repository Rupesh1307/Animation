package com.animation

import android.widget.TextView

class WheelItemStyle {
    fun apply(
        textView: TextView,
        style: WheelPickerStyle,
        isSelected: Boolean,
    ) {
        textView.textSize = style.textSize

        textView.setTextColor(
            if (isSelected) {
                style.selectedTextColor
            } else {
                style.textColor
            },
        )

        textView.setBackgroundColor(style.backgroundColor)
    }
}
