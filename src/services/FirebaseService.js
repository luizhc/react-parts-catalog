import { db } from 'src/firebase';

db.settings({
    timestampsInSnapshots: true
});

export default class FirebaseService {

    ref = db.collection(collection);

    post = (collection, content) => {
        ref.add(content)
    }

    put = (collection, uid, content) => {
        ref.doc(uid).set(content)
    }

    delete = (collection, uid) => {
        ref.doc(uid).delete()
    }

    get = (collection) => {
        let array = [];
        ref.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    array.push({
                        uid: doc.id,
                        ...doc.data()
                    });
                })
                // .catch(error => {
                //     alert(`Request: get | Collection: ${collection} | Error: ${error}`);
                // });
            })
        return array;
    }

}