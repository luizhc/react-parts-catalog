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

interface Customers {
    uid: string;
    name?: string;
    cpf?: string;
    email?: string;
    phone?: string;
    address?: string;
}

interface State {
    customers: Customers[];
    customer: Customers;
};

const ref = db.collection('customers');

class Customer extends React.Component<WithStyles<typeof styles>, State> {
    state: State = {
        customers: [],
        customer: {
            uid: '',
            name: '',
            cpf: '',
            email: '',
            phone: '',
            address: ''
        }
    };

    componentDidMount() {
        this.get();
    }

    get() {
        ref.limit(100).orderBy('name').get()
            .then(snapshot => {
                let customers: any[] = [];
                snapshot.forEach(doc => {
                    customers.push({ uid: doc.id, ...doc.data() });
                })
                this.setState({ customers: customers });
            })
            .catch(error => {
                alert(`Ocorreu algum erro: ${error}`)
            });
    }

    handleChangeName = name => event => {
        this.setState({
            customer: {
                uid: this.state.customer.uid,
                email: this.state.customer.email,
                phone: this.state.customer.phone,
                address: this.state.customer.address,
                cpf: this.state.customer.cpf,
                name: event.target.value
            }
        });
    };

    handleChangeCpf = cpf => event => {
        this.setState({
            customer: {
                uid: this.state.customer.uid,
                name: this.state.customer.name,
                phone: this.state.customer.phone,
                address: this.state.customer.address,
                email: this.state.customer.email,
                cpf: event.target.value
            }
        });
    };

    handleChangePhone = phone => event => {
        this.setState({
            customer: {
                uid: this.state.customer.uid,
                name: this.state.customer.name,
                email: this.state.customer.email,
                address: this.state.customer.address,
                cpf: this.state.customer.cpf,
                phone: event.target.value
            }
        });
    };

    handleChangeEmail = email => event => {
        this.setState({
            customer: {
                uid: this.state.customer.uid,
                name: this.state.customer.name,
                phone: this.state.customer.phone,
                address: this.state.customer.address,
                cpf: this.state.customer.cpf,
                email: event.target.value
            }
        });
    };
    handleChangeAddress = address => event => {
        this.setState({
            customer: {
                uid: this.state.customer.uid,
                name: this.state.customer.name,
                phone: this.state.customer.phone,
                email: this.state.customer.email,
                cpf: this.state.customer.cpf,
                address: event.target.value
            }
        });
    };

    submit = (event) => {
        event.preventDefault();
        const uid = this.state.customer.uid;
        delete this.state.customer.uid;
        if (uid) {
            ref.doc(uid).set(this.state.customer);
        } else {
            ref.add(this.state.customer);
        }
        this.reset();
        this.get();
    };

    reset = () => {
        this.setState({
            customer: {
                uid: '',
                name: '',
                cpf: '',
                email: '',
                phone: '',
                address: ''
            }
        });
    }

    edit = (data) => {
        this.setState({
            customer: data
        });
    }

    remove = (uid) => {
        db.collection('customers').doc(uid).delete();
        this.get();
    }

    render() {
        const { customers } = this.state;
        const { classes } = this.props;

        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h5" component="h2">
                        Clientes
                    </Typography>
                </Toolbar>
                <Toolbar>
                    <form onSubmit={this.submit} className={classes.container}>
                        <TextField
                            type="text"
                            name="name"
                            value={this.state.customer.name}
                            label="Nome"
                            required
                            onChange={this.handleChangeName('name')}
                            autoFocus
                        />
                        <TextField
                            type="text"
                            name="cpf"
                            value={this.state.customer.cpf}
                            className={classes.textField}
                            label="CPF"
                            required
                            onChange={this.handleChangeCpf('cpf')}
                        />
                        <TextField
                            type="email"
                            name="email"
                            value={this.state.customer.email}
                            className={classes.textField}
                            label="E-mail"
                            required
                            onChange={this.handleChangeEmail('email')}
                        />
                        <TextField
                            type="text"
                            name="phone"
                            value={this.state.customer.phone}
                            className={classes.textField}
                            label="Telefone"
                            required
                            onChange={this.handleChangePhone('phone')}
                        />
                        <TextField
                            type="text"
                            name="address"
                            value={this.state.customer.address}
                            className={classes.textField}
                            label="Endereço"
                            required
                            onChange={this.handleChangeAddress('address')}
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
                            <TableCell>CPF</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Endereço</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map(customer => (
                            <TableRow key={customer.uid}>
                                <TableCell> {customer.uid} </TableCell>
                                <TableCell> {customer.name} </TableCell>
                                <TableCell> {customer.cpf} </TableCell>
                                <TableCell> {customer.email} </TableCell>
                                <TableCell> {customer.phone} </TableCell>
                                <TableCell> {customer.address} </TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Button onClick={() => this.edit(customer)}>
                                            <i className="material-icons">
                                                create
                                            </i>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button onClick={() => this.remove(customer.uid)}>
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

export default withRoot(withStyles(styles)(Customer));