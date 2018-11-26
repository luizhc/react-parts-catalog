import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { db } from 'src/firebase';

import withRoot from '../../withRoot';

db.settings({
    timestampsInSnapshots: true
});

const styles = (theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 200,
        }
    });

export interface Manufacturers {
    uid?: string;
    name?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    address?: string;
}

interface State {
    manufacturers: Manufacturers[];
    manufacturer: Manufacturers;
};

const ref = db.collection('manufacturers');

class Manufacturer extends React.Component<WithStyles<typeof styles>, State> {
    state: State = {
        manufacturers: [],
        manufacturer: {
            uid: '',
            name: ''
        }
    };

    componentDidMount() {
        this.get();
    }

    get() {
        ref.limit(100).orderBy('name').get()
            .then(snapshot => {
                let manufacturers: Manufacturers[] = [];
                snapshot.forEach(doc => {
                    manufacturers.push({ uid: doc.id, ...doc.data() as Manufacturers });
                })
                this.setState({ manufacturers: manufacturers });
            })
            .catch(error => {
                alert(`Ocorreu algum erro: ${error}`)
            });
    }

    handleChange = name => event => {
        this.setState({
            manufacturer: {
                uid: this.state.manufacturer.uid,
                name: event.target.value
            }
        });
    };

    submit = (event) => {
        event.preventDefault();
        const uid = this.state.manufacturer.uid;
        delete this.state.manufacturer.uid;
        if (uid) {
            ref.doc(uid).set(this.state.manufacturer);
        } else {
            ref.add(this.state.manufacturer);
        }
        this.reset();
        this.get();
    };

    reset = () => {
        this.setState({
            manufacturer: {
                uid: '',
                name: ''
            }
        });
    }

    edit = (data) => {
        this.setState({
            manufacturer: data
        });
    }

    remove = (uid) => {
        db.collection('manufacturers').doc(uid).delete();
        this.get();
    }

    render() {
        const { manufacturers } = this.state;

        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h5" component="h2">
                        Fabricantes
                    </Typography>
                </Toolbar>
                <Toolbar>
                    <form onSubmit={this.submit}>
                        <TextField
                            type="text"
                            name="name"
                            value={this.state.manufacturer.name}
                            label="Nome"
                            required
                            onChange={this.handleChange('name')}
                            autoFocus
                        />
                        <Tooltip title="Salvar">
                            <Button type="submit" className="btn-submit">
                                <i className="material-icons">
                                    save
                                </i>
                            </Button>
                        </Tooltip>
                    </form>
                </Toolbar>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>CNPJ</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Endereço</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {manufacturers.map(manufacturer => (
                            <TableRow key={manufacturer.uid}>
                                <TableCell> {manufacturer.uid} </TableCell>
                                <TableCell> {manufacturer.cnpj} </TableCell>
                                <TableCell> {manufacturer.email} </TableCell>
                                <TableCell> {manufacturer.phone} </TableCell>
                                <TableCell> {manufacturer.address} </TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Button onClick={() => this.edit(manufacturer)}>
                                            <i className="material-icons">
                                                create
                                            </i>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button onClick={() => this.remove(manufacturer.uid)}>
                                            <i className="material-icons">
                                                delete
                                            </i>
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Manufacturer));