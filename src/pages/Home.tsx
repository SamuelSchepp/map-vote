import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import Spacer from "../tools/Spacer";

function Home() {
  const history = useHistory();
  const [customId, setCustomId] = useState("");

  const route = (id: string) => {
    history.push(`/vote/${id}`)
  }

  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const newUid = uuidv4();
            route(newUid);
          }}
        >
          New vote session
        </Button>
        <Spacer/>
        <Typography>or</Typography>
        <Spacer/>
        <TextField
          label="Enter vote ID"
          variant="outlined"
          defaultValue={customId}
          onChange={(change) => {
            setCustomId(change.target.value);
          }}
          onKeyDown={(event) => {
            console.log(event.key);
            if (event.key === "Enter") {
              route(customId);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Home;

