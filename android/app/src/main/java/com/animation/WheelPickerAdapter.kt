package com.animation

import android.view.Gravity
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class WheelPickerAdapter(
    private var items: List<String>,
    private val style: WheelPickerStyle,
    private val positionMapper: WheelPositionMapper,
) : RecyclerView.Adapter<WheelPickerAdapter.ViewHolder>() {
    class ViewHolder(
        val textView: TextView,
    ) : RecyclerView.ViewHolder(textView)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int,
    ): ViewHolder {
        val textView =
            TextView(parent.context).apply {
                layoutParams =
                    RecyclerView.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        style.itemHeight,
                    )

                gravity = Gravity.CENTER

                textSize = style.textSize

                setTextColor(style.textColor)

                setBackgroundColor(style.backgroundColor)
            }

        return ViewHolder(textView)
    }

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int,
    ) {
        if (items.isEmpty()) {
            holder.textView.text = ""
            return
        }

        val realIndex =
            positionMapper.getRealIndex(position)

        holder.textView.text =
            items[realIndex]

        val params =
            holder.textView.layoutParams as RecyclerView.LayoutParams

        params.height = style.itemHeight

        holder.textView.layoutParams = params

        holder.textView.textSize = style.textSize

        holder.textView.setTextColor(style.textColor)

        holder.textView.setBackgroundColor(style.backgroundColor)
    }

    override fun getItemCount(): Int {
        return positionMapper.getVirtualItemCount()
    }

    fun setItems(data: List<String>) {
        items = data

        positionMapper.setItemCount(data.size)

        notifyDataSetChanged()
    }

    fun getRealItemCount(): Int {
        return items.size
    }

    fun getItemByRealIndex(realIndex: Int): String {
        if (items.isEmpty()) {
            return ""
        }

        return items[realIndex]
    }
}
