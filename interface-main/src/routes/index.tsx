import { Switch, Route, Redirect } from "react-router-dom";
import Routes from "./Routes";

export default function _Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/launchpad" />
      </Route>

      <Routes />
    </Switch>
  );
}
