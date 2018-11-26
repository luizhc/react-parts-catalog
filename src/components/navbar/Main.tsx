import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Customer from '../customer/Customer';
import Home from '../Home';
import Manufacturer from '../manufacturer/Manufacturer';
import PartsList from '../parts/PartsList';
import Products from '../products/Products';

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/parts" component={PartsList} />
            <Route path="/clients" component={Customer} />
            <Route path="/manufacturers" component={Manufacturer} />
            <Route path="/products" component={Products} />
        </Switch>
    </main>
)

export default Main
