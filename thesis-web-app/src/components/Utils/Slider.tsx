import React from "react";
import { Range } from "react-range";

export default function Slider(props: {
  index?: number;
  minimum: number;
  maximum: number;
  stepNumber: number;
  current: number;
  parentCallback: (selectedValue: number | string, index?: number) => void;
}) {
  const [values, setValues] = React.useState([props.current]);

  const parentOnChange = (values: number[]) => {
    setValues(values);
    props.parentCallback(values[0], props.index);
  };

  return (
    <div className="w-48">
      <Range
        step={props.stepNumber}
        min={props.minimum}
        max={props.maximum}
        values={values}
        onChange={(values) => parentOnChange(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md"
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-5 h-5 transform translate-x-10 bg-red-light rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light"
          />
        )}
      />
      <div className="flex justify-between">
        <div>
          <b>{props.minimum}</b>
        </div>
        <span>{values[0]}</span>
        <div>
          <b>{props.maximum}</b>
        </div>
      </div>
    </div>
  );
}
