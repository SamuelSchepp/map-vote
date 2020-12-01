import firebase from "firebase";
import { IMap } from "./types/IMap";
import { User } from "./User";
import { ISession } from "./types/ISession";

export class FirebaseService {

  private config = {
    apiKey: "AIzaSyC2h6-tqrKBpkXMAz3gkgJ1RwgyY_y68Kc",
    authDomain: "map-vote.firebaseapp.com",
    databaseURL: "https://map-vote.firebaseio.com",
    projectId: "map-vote",
    storageBucket: "map-vote.appspot.com",
    messagingSenderId: "966271693992",
    appId: "1:966271693992:web:40693353b161c58933be9d"
  };
  private app: firebase.app.App;
  private database: firebase.database.Database;

  public constructor(
    private user: User
  ) {
    this.app = firebase.initializeApp(this.config);
    this.database = this.app.database();
  }

  public vote(mapId: string, sessionId: string, change: number) {
    const ref = this.database.ref(`/session/${sessionId}/map/${mapId}/user/${this.user.getId()}`);
    ref.transaction((value: number | null) => {
      return change;
    });
  }

  public maps(f: (maps: {[id: string]: IMap}) => void) {
    return this.database.ref("map").on("value", (snapshot) => {
      f(snapshot.val());
    })
  }

  public session(sessionId: string, f: (session: ISession) => void) {
    return this.database.ref(`/session/${sessionId}`).on("value", (snapshot) => {
      const session: ISession = snapshot.val() ?? {map: {}};
      f(session);
    });
  }
}
