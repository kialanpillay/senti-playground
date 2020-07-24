import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["orange", "gray", "silver"];
//Piechart that plots generated sentiment polarity scores

export default function SentimentScorePieChart(props) {
  let data;
  if (props.route === "bayes/") {
    //Senti Naive Bayes method does not generate polarity scores; default values are assigned
    data = [
      {
        name: "Positive",
        value: props.data.classification === "Positive" ? 100 : 0,
      },
      {
        name: "Negative",
        value: props.data.classification === "Positive" ? 0 : 100,
      },
      {
        name: "Neutral",
        value: 0,
      },
    ];
  } else {
    data = [
      {
        name: "Positive",
        value: Math.round(props.data.pos * 100, 2),
      },
      {
        name: "Negative",
        value: Math.round(props.data.neg * 100, 2),
      },
      {
        name: "Neutral",
        value: Math.round(props.data.neu * 100, 2),
      },
    ];
  }

  return (
    <PieChart width={300} height={160}>
      <Tooltip />
      <Pie
        data={data}
        cx={150}
        cy={150}
        label
        labelLine={false}
        outerRadius={100}
        startAngle={180}
        endAngle={0}
        animationDuration={1000}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}{" "}
        {/*Maps each segment to a different color for rendering*/}
      </Pie>
    </PieChart>
  );
}
