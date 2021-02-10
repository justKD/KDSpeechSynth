/**
 * @fileoverview
 * - swap position of first controls and example accordion
 * - add table output as second set of controls
 * - change the title in the examples accordion and update the example via the select
 */

import * as React from "react";
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import { ExampleHoc } from "./_ExampleHoc";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import MuiTableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const TableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(MuiTableCell);

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    controls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    control: {
      flex: 1,
    },
    leftControl: {
      marginRight: theme.spacing(2),
    },
  });
});

export const ThirdExample = (): React.ReactElement => {
  const classes = useStyles();

  const [example, setExample] = React.useState(0);
  const [output, setOutput] = React.useState(example);

  const text = React.useMemo(() => {
    return {
      title: "Example Three",
      id: "example-3",
      description: "Description.",
      codeExample: ` 
      code example
      `,
    };
  }, []);

  const moreExamples = React.useMemo(() => {
    return [
      {
        title: `/* Example 0 */`,
        example: `
      /**
       * example 0
       */
    
      more examples 0
      `,
      },
      {
        title: `/* Example 1 */`,
        example: `
      /**
       * example 1
       */
    
      more examples 1
      `,
      },
      {
        title: `/* Example 2 */`,
        example: `
      /**
       * example 2
       */
    
      more examples 2
      `,
      },
    ];
  }, []);

  const EventTable = React.useMemo(() => {
    const footnote = 'Select an example and click "Run".';
    return (
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Output</TableCell>
              <TableCell align="right">{output}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Typography variant={"caption"}>{footnote}</Typography>
      </TableContainer>
    );
  }, [output]);

  const RunButton = React.useMemo(() => {
    const onclick = () => {
      setOutput(example);
    };

    return (
      <Button
        className={`${classes.control} ${classes.leftControl}`}
        onClick={onclick}
        variant="outlined"
        disableElevation
      >
        Run
      </Button>
    );
  }, [classes.control, classes.leftControl, setOutput, example]);

  const SelectList = React.useMemo(() => {
    return (
      <Select
        className={classes.control}
        value={example}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          setExample(event.target.value as number);
        }}
      >
        {["Example 0", "Example 1", "Example 2"].map((item, index) => {
          return (
            <MenuItem key={index} value={index}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    );
  }, [classes.control, example, setExample]);

  const Controls = React.useMemo(() => {
    return (
      <div>
        <div className={classes.controls}>
          {RunButton}
          {SelectList}
        </div>
      </div>
    );
  }, [classes.controls, RunButton, SelectList]);

  const MoreControls = React.useMemo(() => {
    return <div>{EventTable}</div>;
  }, [EventTable]);

  return (
    <ExampleHoc
      id={text.id}
      title={text.title}
      description={text.description}
      codeExample={text.codeExample}
      controls={Controls}
      moreExamplesTitle={moreExamples[example].title}
      moreExamples={moreExamples[example].example}
      controlsBeforeMoreExamples
      moreControls={MoreControls}
    />
  );
};
