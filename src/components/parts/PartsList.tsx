import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class PartsList extends React.Component {
    public render(): React.ReactNode {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Catálogo de Peças
                    </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default PartsList;