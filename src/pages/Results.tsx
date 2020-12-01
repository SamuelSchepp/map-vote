import { FirebaseService } from "../FirebaseService";
import { User } from "../User";
import { Style } from "../Style";
import { Typography } from "@material-ui/core";
import Spacer from "../tools/Spacer";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMap } from "../types/IMap";
import { ISession } from "../types/ISession";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

function Results(props: {firebase: FirebaseService, user: User}) {
  const history = useHistory();
  const { voteId } = useParams<{voteId: string}>();
  const [maps, setMaps] = useState<{[id: string]: IMap}>({});
  const [session, setSession] = useState<ISession>({ map: {} });
  const [ignopreDownvotesInSorting, setIgnopreDownvotesInSorting] = useState(false);

  useEffect(() => {
    props.firebase.maps((maps) => {
      setMaps(maps);
    });
    props.firebase.session(voteId, (session) => {
      setSession(session);
    });
  }, [props.firebase, voteId]);

  const upVotes = (mapId: string) => {
    return Object.values(session.map[mapId]?.user ?? []).reduce((akku: number, next) => {
      if ((next ?? 0) > 0) {
        return akku + 1;
      } else {
        return akku;
      }
    }, 0);
  }

  const downVotes = (mapId: string) => {
    return Object.values(session.map[mapId]?.user ?? []).reduce((akku: number, next) => {
      if ((next ?? 0) < 0) {
        return akku + 1;
      } else {
        return akku;
      }
    }, 0);
  }

  const sortedMapKeys = () => {
    const mapkeys = Object.keys(maps);
    mapkeys.sort((a, b) => {
      if (ignopreDownvotesInSorting) {
        return upVotes(b) - upVotes(a);
      } else {
        return (upVotes(b) - downVotes(b)) - (upVotes(a) - downVotes(a));
      }
    })
    return mapkeys;
  }

  const userCount = () => {
    const users = new Set<string>();
    const mapkeys = Object.keys(session.map);
    for (const mapKey of mapkeys) {
      const userIds = Object.keys(session.map[mapKey]?.user ?? {});
      for (const userId of userIds) {
        users.add(userId);
      }
    }
    return users.size;
  }

  const percentage = (votes: number) => {
    if (userCount() === 0) {
      return "";
    } else {
      return `(${Math.round(votes / userCount() * 100)} %)`
    }
  }

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
        <FormControlLabel
          control={
            <Checkbox
              checked={ignopreDownvotesInSorting}
              onChange={(event) => {
                setIgnopreDownvotesInSorting(event.target.checked);
              }}
              color="primary"
            />
          }
          label="Ignore downvotes"
        />
        <Spacer/>
        <Typography>
          {userCount()} users voted.
        </Typography>
        <Spacer/>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(5, auto)",
            alignItems: "center",
          }}
        >
          {
            sortedMapKeys().map((mapId: string) => {
              return (
                <>
                  <div
                    key={`${mapId}_img`}
                    style={{
                      height: "50px",
                      width: "50px",
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
                  </div>
                  <Typography
                    key={`${mapId}_name`}
                  >
                    {maps[mapId].name ?? "no name"}
                  </Typography>
                  <Box
                    key={`${mapId}_upvotes`}
                    color={"success.main"}
                  >
                    <Typography>
                      {upVotes(mapId)} {percentage(upVotes(mapId))}
                    </Typography>
                  </Box>
                  <Box
                    key={`${mapId}_downvotes`}
                    color={ignopreDownvotesInSorting ? "text.disabled" : "error.main"}
                    style={{
                      textDecoration: ignopreDownvotesInSorting ? "line-through" : "",
                    }}
                  >
                    <Typography>
                      {downVotes(mapId)} {percentage(downVotes(mapId))}
                    </Typography>
                  </Box>
                  <Box
                    key={`${mapId}_score`}
                    color={ignopreDownvotesInSorting ? "text.disabled" : "text.primary"}
                    style={{
                      textDecoration: ignopreDownvotesInSorting ? "line-through" : "",
                    }}
                  >
                    <Typography>
                      Score: {upVotes(mapId) - downVotes(mapId)}
                    </Typography>
                  </Box>
                </>
              );
            })
          }
        </div>
        <Spacer/>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(`/vote/${voteId}`);
          }}
        >
          Back to voting
        </Button>
      </div>
    </div>
  );
}

export default Results;
