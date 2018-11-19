import { db } from 'src/firebase';

const ref = db.collection('parts');

export const postPart = (content) => {
    ref.add(content)
}

export const putPart = (uid, content) => {
    ref.doc(uid).set(content)
}

export const deletePart = (uid) => {
    ref.doc(uid).delete();
}