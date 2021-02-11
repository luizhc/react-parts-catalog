import * as React from 'react';

import { ListItemLink } from '../ListItemLink';

const Routes = () => (
    <nav>
        <ListItemLink to="/">Home</ListItemLink>
        <ListItemLink to="/customers">Clientes</ListItemLink>
        <ListItemLink to="/parts">Peças</ListItemLink>
        <ListItemLink to="/manufacturers">Fabricantes</ListItemLink>
        <ListItemLink to="/products">Produtos</ListItemLink>
    </nav>
)

export default Routes