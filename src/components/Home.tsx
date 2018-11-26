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

import withRoot from '../withRoot';
import { Manufacturers } from './manufacturer/Manufacturer';
import { Part } from './parts/PartsList';
import { Product } from './products/Products';

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

interface State {
  products: Product[];
  product: Product;
  quantity?: number;
  total?: number;
};

const ref = db.collection('products');

class Home extends React.Component<WithStyles<typeof styles>, State> {
  state: State = {
    products: [],
    
    product: {
      uid: '',
      group: {
        uid: '',
        nome: ''
      },
      manufacturer: {
        uid: '',
        name: ''
      },
      parts: {
        uid: '',
        name: ''
      },
      brand: {
        nome: ''
      },
      unitary: 0,
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

  handleChange = quantity => event => {
    console.log(this.state.product.unitary);
    this.setState({
      product: {
        uid: this.state.product.uid,
        manufacturer: {
          uid: this.state.product.manufacturer.uid,
          name: this.state.product.manufacturer.name
        },
        parts: {
          uid: this.state.product.parts.uid,
          name: this.state.product.parts.name
        },
        group: {
          uid: this.state.product.group.nome,
          nome: this.state.product.group.nome
        },
        unitary: this.state.product.unitary,
        brand: {
          nome: this.state.product.brand.nome
        },
        [quantity]: event.target.value,
        total: event.target.value * this.state.product.unitary
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
        },
        parts: {
          uid: '',
          name: ''
        },
        unitary: 0
      },
      quantity: 0,
      total: 0
    });
  }

  edit = (data) => {
    this.setState({
      product: data
    });
  }

  render() {
    const { products } = this.state;
    const { classes } = this.props;

    return (
      <Paper>
        <Toolbar>
          <Typography variant="h4" component="h4">
            Selecione um item e realize seu pedido
          </Typography>
        </Toolbar>
        <Toolbar>
          <form onSubmit={this.submit}>
            <TextField
              type="text"
              name="name"
              className={classes.textField}
              value={this.state.product.group.nome}
              label="Grupo"
              required
            />
            <TextField
              type="text"
              name="parts"
              className={classes.textField}
              value={this.state.product.parts.name}
              label="Peça"
              required
            />
            <TextField
              type="text"
              name="name"
              className={classes.textField}
              value={this.state.product.unitary}
              label="Unitário"
              required
            />
            <TextField
              type="text"
              name="quantity"
              className={classes.textField}
              value={this.state.quantity}
              label="Quantidade"
              onChange={this.handleChange('quantity')}
              required
              autoFocus
            />
            <TextField
              type="text"
              name="total"
              className={classes.textField}
              value={this.state.total}
              label="Total"
              required
            />
            <Tooltip title="Salvar">
              <Button type="submit" className="btn-submit">
                <i className="material-icons">
                  add_shopping_cart
                </i>
              </Button>
            </Tooltip>
          </form>
        </Toolbar>
        <Toolbar>
          <Typography variant="h5" component="h5" align="center">
            Catálogo de Produtos
           </Typography>
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
                  <Tooltip title="Comprar">
                    <Button onClick={() => this.edit(product)}>
                      <i className="material-icons">
                        add_shopping_cart
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

export default withRoot(withStyles(styles)(Home));