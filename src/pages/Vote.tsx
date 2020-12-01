import { Typography } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { FirebaseService } from "../FirebaseService";
import { useEffect, useState } from "react";
import { IMap } from "../types/IMap";
import { Style } from "../Style";
import { ISession } from "../types/ISession";
import { User } from "../User";
import Spacer from "../tools/Spacer";

function Vote(props: {firebase: FirebaseService, user: User}) {
  const history = useHistory();
  const { voteId } = useParams<{voteId: string}>();
  const [maps, setMaps] = useState<{[id: string]: IMap}>({});
  const [session, setSession] = useState<ISession>({ map: {} });

  useEffect(() => {
    props.firebase.maps((maps) => {
      setMaps(maps);
    });
    props.firebase.session(voteId, (session) => {
      setSession(session);
    });
  }, [props.firebase, voteId]);


  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: Style.padding,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>
          Share this vote session by sending the link to your friends.
        </Typography>
        <Spacer/>
        <Spacer/>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
            gridAutoRows: "400px",
          }}
        >
        {
          Object.keys(maps).map((mapId: string) => {
            return (
              <div
                key={mapId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "stretch"
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    position: "relative",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    src={maps[mapId].imageUrl ?? ""}
                    alt={maps[mapId].name ?? "no name"}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: (session.map[mapId]?.user[props.user.getId()] ?? 0) > 0 ? "rgba(0, 255, 0, 0.2)": "rgba(255, 0, 0, 0.2)"
                    }}
                    hidden={(session.map[mapId]?.user[props.user.getId()] ?? 0) === 0}
                  >
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: Style.padding,
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Typography
                      style={{

                      }}
                    >
                      {maps[mapId].name ?? "no name"}
                    </Typography>
                  </div>
                </div>
                <Spacer/>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      if ((session.map[mapId]?.user[props.user.getId()] ?? 0) > 0) {
                        props.firebase.vote(mapId, voteId, 0);
                      } else {
                        props.firebase.vote(mapId, voteId, 1);
                      }
                    }}
                    variant="contained"
                    color={(session.map[mapId]?.user[props.user.getId()] ?? 0) > 0 ? "primary": "default"}
                  >
                    +1
                  </Button>
                  <Spacer/>
                  <Button
                    onClick={() => {
                      if ((session.map[mapId]?.user[props.user.getId()] ?? 0) < 0) {
                        props.firebase.vote(mapId, voteId, 0);
                      } else {
                        props.firebase.vote(mapId, voteId, -1);
                      }
                    }}
                    variant="contained"
                    color={(session.map[mapId]?.user[props.user.getId()] ?? 0) < 0 ? "secondary": "default"}
                  >
                    -1
                  </Button>
                </div>
              </div>
            );
          })
        }
        </div>
        <Spacer/>
        <Spacer/>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(`/vote/${voteId}/results`);
          }}
        >
          Show results
        </Button>
        <Spacer/>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/")
          }}
        >
          Create a new vote session
        </Button>
      </div>
    </div>
  );
}

export default Vote;
