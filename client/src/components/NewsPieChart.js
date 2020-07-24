import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["orange", "gray", "silver"];
//Piechart that displays the binned sentiment classification count of a set of news articles

export default function NewsPieChart(props) {
  const data = [
    {
      name: "Positive",
      value: props.positive,
    },
    {
      name: "Negative",
      value: props.negative,
    },
    {
      name: "Neutral",
      value: props.neutral,
    },
  ];

  return (
    <PieChart width={300} height={200}>
      <Tooltip />
      <Pie
        data={data}
        cx={80}
        cy={100}
        label
        labelLine={false}
        outerRadius={70}
        animationDuration={1000}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
