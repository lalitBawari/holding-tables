import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeProvider, colors, createTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import shadows from "@mui/material/styles/shadows";
import { BorderAllRounded, FitScreenRounded } from "@mui/icons-material";

function App() {
  const [list, setList] = useState({
    Bond: [],
    Cash: [],
    Equity: [],
    Fund: [],
    Loan: [],
    Real_Estate: [],
  });

  useEffect(() => {
    const url = "https://canopy-frontend-task.vercel.app/api/holdings";
    async function getHoldings() {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          setList((pv) => {
            data.payload.forEach((v) => {
              pv[v.asset_class.split(" ").join("_")].push(v);
            });

            return pv;
          });
        } else {
          throw new Error("something went wrong!!");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getHoldings();
  }, []);

  const theme = createTheme({
    palette: {
      primary: blueGrey, // Use blueGrey for table background
    },
    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            borderRadius: 10, // Set table border radius
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            maxWidth: "98vw",
            borderRadius: 10,
            margin: "20px auto",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            ":nth-of-type(odd)": colors.grey[400],
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {},
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {Object.entries(list)
              .reverse()
              .map((k, v) => (
                <Row row={k[1]} group={k[0]} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

function Row(props) {
  const { row, group } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell align="left" width={10}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">
          {group} ({row.length})
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer component={Paper}>
              <Table size="medium" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell minWidth={"30%"}>NAME OF THE HOLDINGS</TableCell>
                    <TableCell align="left">TICKER</TableCell>
                    <TableCell align="left">AVERAGE PRICE</TableCell>
                    <TableCell align="left">MARKET PRICE</TableCell>
                    <TableCell align="left">LATEST CHANGE PERCENTAGE</TableCell>
                    <TableCell align="left">MARKET VALUE IN BASE CCY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.map((r, i) => (
                    <TableRow
                      key={r.name + i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {r.name}
                      </TableCell>
                      <TableCell align="left">{r.ticker}</TableCell>
                      <TableCell align="left">{r.avg_price}</TableCell>
                      <TableCell align="left">{r.market_price}</TableCell>
                      <TableCell align="left">{r.latest_chg_pct}</TableCell>
                      <TableCell align="left">{r.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default App;
