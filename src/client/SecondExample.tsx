/**
 * @fileoverview
 * - add a table to controls for viewing output
 */

import * as React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { ExampleHoc } from "./_ExampleHoc";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    controls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
  });
});

export const SecondExample = (): React.ReactElement => {
  const classes = useStyles();

  const [tableList, setTableList] = React.useState([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);

  const text = React.useMemo(() => {
    return {
      title: "Example Two",
      id: "example-2",
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

  const EventTable = React.useMemo(() => {
    const header = () => {
      return (
        <TableRow>
          <TableCell>Column 1</TableCell>
          <TableCell align="right">Column 2</TableCell>
          <TableCell align="right">Column 3</TableCell>
        </TableRow>
      );
    };

    const mappedTableList = () => {
      return tableList.map((row, index) => {
        return (
          <TableRow key={index}>
            <TableCell>{row[0]}</TableCell>
            <TableCell align="right">{row[1]}</TableCell>
            <TableCell align="right">{row[2]}</TableCell>
          </TableRow>
        );
      });
    };

    const footnote = "footnote";

    return (
      <TableContainer>
        <Table>
          <TableHead>{header()}</TableHead>
          <TableBody>{mappedTableList()}</TableBody>
        </Table>
        <Typography variant={"caption"}>{footnote}</Typography>
      </TableContainer>
    );
  }, [tableList]);

  const IncrementButton = React.useMemo(() => {
    const onclick = () => {
      setTableList(tableList.map((row) => row.map((item) => ++item)));
    };

    return (
      <Button onClick={onclick} variant="outlined" fullWidth disableElevation>
        Increment
      </Button>
    );
  }, [tableList, setTableList]);

  const Controls = React.useMemo(() => {
    return (
      <div>
        <div className={classes.controls}>{IncrementButton}</div>
        {EventTable}
      </div>
    );
  }, [classes.controls, EventTable, IncrementButton]);

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
