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
import * as React from 'react';
import { db } from 'src/firebase';

const ref = db.collection('parts');

export interface Part {
    uid: string;
    name: string;
}

interface State {
    pecas: Part[];
    peca: Part;
    focus: any;
};

class Parts extends React.Component<{}, State> {
    state: State = {
        pecas: [],
        peca: {
            uid: null,
            name: ''
        },
        focus: null
    };

    componentDidMount() {
        this.get();
    }

    get() {
        ref.limit(100).orderBy('name').get()
            .then(snapshot => {
                let parts: Part[] = [];
                snapshot.forEach(doc => {
                    parts.push({ uid: doc.id, ...doc.data() as Part });
                })
                this.setState({ pecas: parts });
            })
            .catch(error => {
                alert(`Ocorreu algum erro: ${error}`)
            });
        this.state.focus.focus();
    }

    edit = (data) => {
        this.setState({
            peca: data
        });
        this.state.focus.focus();
    }

    remove = (uid) => {
        db.collection('parts').doc(uid).delete();
        this.get();
    }

    submit = (event) => {
        event.preventDefault();
        const uid = this.state.peca.uid;
        delete this.state.peca.uid;
        if (uid) {
            ref.doc(uid).set(this.state.peca);
        } else {
            ref.add(this.state.peca);
        }
        this.reset();
        this.get();
    };

    handleChange = name => event => {
        this.setState({
            peca: {
                uid: this.state.peca.uid,
                name: event.target.value
            }
        });
    };

    reset = () => {
        this.setState({
            peca: {
                uid: null,
                name: ''
            }
        });
    }

    public render(): React.ReactNode {
        const { pecas } = this.state;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h5" component="h2">
                        Peças
                        </Typography>
                </Toolbar>
                <Toolbar>
                    <form onSubmit={this.submit}>
                        <TextField
                            type="text"
                            name="name"
                            value={this.state.peca.name}
                            label="Nome"
                            required
                            onChange={this.handleChange('name')}
                            autoFocus
                            inputRef={el => this.state.focus = el}
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
                            <TableCell>Nome</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pecas.map(peca => (
                            <TableRow key={peca.uid}>
                                <TableCell> {peca.uid} </TableCell>
                                <TableCell> {peca.name} </TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Button onClick={() => this.edit(peca)}>
                                            <i className="material-icons">
                                                create
                                           </i>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button onClick={() => this.remove(peca.uid)}>
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
        )
    }
}

export default Parts;