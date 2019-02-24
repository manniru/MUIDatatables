import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Cities from "./cities";

import { fb } from "./fb";

class App extends React.Component {
  state = {
    data: ""
  };
  componentDidMount = () => {
    fb.database()
      .ref("/mui")
      .on("value", snap => {
        if (snap.val()) {
          this.setState({ data: Object.values(snap.val()) });
        }
      });
  };
  render() {
    const { data } = this.state;

    const columns = [
      {
        name: "Name",
        options: {
          filter: false
        }
      },
      {
        name: "Title",
        options: {
          filter: true
        }
      },
      {
        name: "Location",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Cities
                value={value}
                index={tableMeta.columnIndex}
                change={event => updateValue(event)}
              />
            );
          }
        }
      },
      {
        name: "Age",
        options: {
          filter: false
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const nf = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return nf.format(value);
          }
        }
      },
      {
        name: "Active",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <FormControlLabel
                label={value ? "Yes" : "No"}
                value={value ? "Yes" : "No"}
                control={
                  <Switch
                    color="primary"
                    checked={value}
                    value={value ? "Yes" : "No"}
                  />
                }
                onChange={event => {
                  updateValue(event.target.value === "Yes" ? false : true);
                }}
              />
            );
          }
        }
      }
    ];

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive: "scroll"
    };

    return (
      <div>
        {data.length > 0 ? (
          <MUIDataTable
            title={"Mannir Employee list"}
            data={data}
            columns={columns}
            options={options}
          />
        ) : (
          "Loading..."
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
