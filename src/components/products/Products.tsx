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
import { Manufacturers } from '../manufacturer/Manufacturer';
import { Part } from '../parts/Parts';

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

interface Group {
    uid: string;
    nome: string;
}

export interface Product {
    uid?: string;
    manufacturer?: Manufacturers;
    createdAt?: string;
    parts?: Part;
    group: Group;
    url?: string;
    unitary?: number;
    brand?: {
        nome: string;
    }
}

interface State {
    products: Product[];
    product: Product;
};

const ref = db.collection('products');

class Products extends React.Component<WithStyles<typeof styles>, State> {
    state: State = {
        products: [],
        product: {
            uid: '',
            group: {
                uid: '',
                nome: ''
            }
        }
    };

    componentDidMount() {
        this.get();
    }

    get() {
        ref.limit(100).orderBy('group.nome').get()
            .then(snapshot => {
                let products: Product[] = [];
                snapshot.forEach(doc => {
                    products.push({ uid: doc.id, ...doc.data() as Product });
                })
                this.setState({ products: products });
            })
            .catch(error => {
                alert(`Ocorreu algum erro: ${error}`)
            });
    }

    handleChange = name => event => {
        this.setState({
            product: {
                uid: '',
                group: {
                    uid: '',
                    nome: ''
                }
            }
        });
    };

    submit = (event) => {
        event.preventDefault();
        const uid = this.state.product.uid;
        delete this.state.product.uid;
        if (uid) {
            ref.doc(uid).set(this.state.product);
        } else {
            ref.add(this.state.product);
        }
        this.reset();
        this.get();
    };

    reset = () => {
        this.setState({
            product: {
                uid: '',
                group: {
                    uid: '',
                    nome: ''
                }
            }
        });
    }

    edit = (data) => {
        this.setState({
            product: data
        });
    }

    remove = (uid) => {
        db.collection('products').doc(uid).delete();
        this.get();
    }

    render() {
        const { products } = this.state;

        return (
            <Paper>
                <Toolbar>
                    <Typography variant="h5" component="h2">
                        Produtos
                    </Typography>
                </Toolbar>
                <Toolbar>
                    <form onSubmit={this.submit}>
                        <TextField
                            type="text"
                            name="name"
                            value={this.state.product.group.nome}
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
                            <TableCell>Fabricante</TableCell>
                            <TableCell>Modelo</TableCell>
                            <TableCell>Grupo</TableCell>
                            <TableCell>Peça</TableCell>
                            <TableCell>Valor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.uid}>
                                <TableCell> {product.uid} </TableCell>
                                <TableCell> {product.manufacturer.name} </TableCell>
                                <TableCell> {product.brand.nome} </TableCell>
                                <TableCell> {product.group.nome} </TableCell>
                                <TableCell> {product.parts.name} </TableCell>
                                <TableCell> {product.unitary} </TableCell>
                                <TableCell>
                                    <Tooltip title="Editar">
                                        <Button onClick={() => this.edit(product)}>
                                            <i className="material-icons">
                                                create
                                            </i>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button onClick={() => this.remove(product.uid)}>
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

export default withRoot(withStyles(styles)(Products));