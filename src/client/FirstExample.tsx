/**
 * @fileoverview
 * - basic example using _ExampleHoc.tsx
 */

import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ExampleHoc } from "./_ExampleHoc";
import Button from "@material-ui/core/Button";

import { animate } from "./util/animate";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    controls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    button: {
      flex: 1,
    },
    leftButton: {
      marginRight: theme.spacing(2),
    },
  });
});

export const FirstExample = (): React.ReactElement => {
  const classes = useStyles();

  const text = React.useMemo(() => {
    return {
      title: "Example One",
      id: "example-1",
      description: "Description.",
      codeExample: ` 
      code example
      `,
      moreExamples: `
      /**
       * More Examples 1
       */
  
      more examples 1
  
      /**
       * More Examples 2
       */
  
      more examples 2
      `,
    };
  }, []);

  const Controls = React.useMemo(() => {
    const LeftButton = () => {
      const ref = React.useRef(null);

      const onclick = () => {
        const node = ref?.current;
        if (node) animate(node, "jello");
      };

      return (
        <Button
          ref={ref}
          onClick={onclick}
          className={`${classes.button} ${classes.leftButton}`}
          variant="outlined"
          disableElevation
        >
          Jello
        </Button>
      );
    };

    const RightButton = () => {
      const ref = React.useRef(null);

      const onclick = () => {
        const node = ref?.current;
        if (node) animate(node, "shake");
      };

      return (
        <Button
          ref={ref}
          onClick={onclick}
          className={classes.button}
          variant="outlined"
          disableElevation
        >
          Shake
        </Button>
      );
    };

    return (
      <div className={classes.controls}>
        <LeftButton />
        <RightButton />
      </div>
    );
  }, [classes.controls, classes.button, classes.leftButton]);

  return (
    <ExampleHoc
      id={text.id}
      title={text.title}
      description={text.description}
      codeExample={text.codeExample}
      moreExamples={text.moreExamples}
      controls={Controls}
    />
  );
};
