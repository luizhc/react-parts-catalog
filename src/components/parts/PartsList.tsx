import { AppBar, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Typography, Tooltip } from '@material-ui/core';
import * as React from 'react';
import { db } from 'src/firebase';

db.settings({
    timestampsInSnapshots: true
});

const ref = db.collection('parts');

class PartsList extends React.Component<{}> {
    // state: PartsInterface = {
    //     name: ''
    // };
    state = {
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
                let parts: any[] = [];
                snapshot.forEach(doc => {
                    parts.push({ uid: doc.id, ...doc.data() });
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
                [name]: event.target.value
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
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="headline" color="inherit">
                            Catálogo de Peças
                            </Typography>
                    </Toolbar>
                </AppBar>
                <Paper>
                    <Toolbar>
                        <Typography variant="headline" component="h2">
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
            </React.Fragment>
        )
    }
}

export default PartsList;