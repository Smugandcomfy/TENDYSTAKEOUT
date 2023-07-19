import { lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import MainLayout from "components/AppBody";
import Loadable from "../components/Loading/Loadable";
import PageNotFound from "components/404";

const WalletTokenList = Loadable(lazy(() => import("../views/wallet/TokenList")));

const Console = Loadable(lazy(() => import("../views/console/index")));

const Launchpad = Loadable(lazy(() => import("../views/launchpad")));
const CreateLaunchpad = Loadable(lazy(() => import("../views/launchpad/create")));
const MyLaunchpad = Loadable(lazy(() => import("../views/launchpad/my")));

const ckBTC = Loadable(lazy(() => import("../views/wallet/ckBTC")));

export default function MainRoutes() {
  const location = useLocation();

  return (
    <Route
      path={[
        "/wallet/token",
        "/wallet/token/transactions/:id",

        "/wallet/ckBTC",

        "/launchpad",

        "/console",

        "/console/launchpad/create",
        "/console/launchpad/your",
      ]}
    >
      <MainLayout>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/wallet/token" component={WalletTokenList} />

          <Route exact path="/wallet/ckBTC" component={ckBTC}></Route>

          <Route exact path="/launchpad" component={Launchpad} />

          <Route exact path="/console/launchpad/create" component={CreateLaunchpad} />
          <Route exact path="/console/launchpad/your" component={MyLaunchpad} />
          <Route exact path="/console" component={Console} />

          <Route path="*" component={PageNotFound} />
        </Switch>
      </MainLayout>
    </Route>
  );
}
