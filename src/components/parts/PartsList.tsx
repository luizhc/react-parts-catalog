import {
    AppBar,
    Button,
    createMuiTheme,
    MuiThemeProvider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { purple } from '@material-ui/core/colors';
import * as React from 'react';
import { db } from 'src/firebase';

// import { postParts } from 'src/services/PartsService';

// import PartsInterface from '../../models/PartsInterface';

const theme = createMuiTheme({
    palette: {
        primary: purple,
    },
});

class PartsList extends React.Component<{}> {
    // state: PartsInterface = {
    //     name: ''
    // };
    state = {
        pecas: [],
        post: { 
            name: '' 
        }
    };

    componentDidMount() {
        ;
        db.settings({
            timestampsInSnapshots: true
        });

        const partsRef = db.collection('parts');
        let parts: any[] = [];

        partsRef.limit(100).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    parts.push({ uid: doc.id, ...doc.data() });
                })
                this.setState({ pecas: parts });
            })
            .catch(error => {
                console.log('Ocorreu algum erro: ', error);
            });
    }

    submit = (event) => {
        event.preventDefault();

        const partsRef = db.collection('parts');
        // console.log(this.state.post);
        partsRef.add(this.state.post);
    };

    public render(): React.ReactNode {
        const { pecas } = this.state;
        return (
            <MuiThemeProvider theme={theme}>
                <React.Fragment>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="headline" color="inherit">
                                Catálogo de Peças
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar>
                        <Typography variant="headline" component="h2">
                            Peças
                        </Typography>
                    </Toolbar>
                    <Toolbar>
                        <form onSubmit={this.submit}>
                            <TextField className="input-field"
                                type="text"
                                defaultValue={''}
                                label="Nome"
                                required
                                onChange={e => this.state.post.name = e.target.value} />
                            <Button type="submit" style={{ marginTop: '20px', display: 'inline-block' }}>
                                Salvar
                            </Button>
                        </form>
                    </Toolbar>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Nome</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pecas.map(peca => (
                                <TableRow key={peca.uid}>
                                    <TableCell> {peca.uid} </TableCell>
                                    <TableCell> {peca.name} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </React.Fragment>
            </MuiThemeProvider >
        )
    }
}

export default PartsList;