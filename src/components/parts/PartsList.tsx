import * as React from 'react';

import PartsInterface from '../../models/PartsInterface';
import { db } from 'src/firebase';

class PartsList extends React.Component<{}, PartsInterface> {
    state: PartsInterface = {
        name: ''
    };

    componentDidMount() {;
        db.settings({
            timestampsInSnapshots: true
        });

        var partsRef = db.collection("parts").doc("1TQ28ZX1jomDmTzFqyFW");

        partsRef.get().then(doc => {
            if (doc.exists) {
                this.setState({
                    name: (doc.data() as PartsInterface).name
                })
            } else {
                console.log("Nenhum documento!");
            }
        }).catch(error => {
            console.log("Erro ao pegar documento:", error);
        });
    }

    public render(): React.ReactNode {
        return (
            <div>
                <h1>Parts Component</h1>
                Peça: {this.state.name}
                <br />
            </div>
        )
    }
}

export default PartsList;