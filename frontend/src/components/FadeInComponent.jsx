import React from "react";
import { Transition } from "react-transition-group";

import { defaultStyle, transitionStyles } from "../helpers/transitions";
const FadeInComponent = ({
  duration = 1000,
  className,
  showComponent = true,
  children,
}) => {
  return (
    <Transition in={showComponent} timeout={duration}>
      {(transitionState) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[transitionState],
          }}
          className={className}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

export default FadeInComponent;
