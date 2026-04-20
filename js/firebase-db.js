/**
 * DropShop — Firebase Firestore Database
 * Salva ordini e prodotti nel cloud
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseApp = initializeApp(CONFIG.firebase);
const db = getFirestore(firebaseApp);

const FirebaseDB = {

    // ============================
    // ORDINI
    // ============================
    async saveOrder(order) {
        try {
            const ref = await addDoc(collection(db, 'orders'), {
                ...order,
                createdAt: new Date()
            });
            console.log('[Firebase] Ordine salvato:', ref.id);
            return ref.id;
        } catch (err) {
            console.warn('[Firebase] Errore salvataggio ordine:', err.message);
            // Fallback: salva in localStorage
            const orders = JSON.parse(localStorage.getItem('dropshop_orders') || '[]');
            orders.push(order);
            localStorage.setItem('dropshop_orders', JSON.stringify(orders));
            return null;
        }
    },

    async getOrders() {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) {
            console.warn('[Firebase] Errore lettura ordini:', err.message);
            return JSON.parse(localStorage.getItem('dropshop_orders') || '[]');
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date() });
            return true;
        } catch (err) {
            console.warn('[Firebase] Errore update ordine:', err.message);
            return false;
        }
    },

    // ============================
    // PRODOTTI
    // ============================
    async saveProduct(product) {
        try {
            const ref = await addDoc(collection(db, 'products'), {
                ...product,
                createdAt: new Date()
            });
            return ref.id;
        } catch (err) {
            console.warn('[Firebase] Errore salvataggio prodotto:', err.message);
            return null;
        }
    },

    async getProducts() {
        try {
            const snapshot = await getDocs(collection(db, 'products'));
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) {
            console.warn('[Firebase] Errore lettura prodotti:', err.message);
            return JSON.parse(localStorage.getItem('dropshop_products') || '[]');
        }
    }
};

window.FirebaseDB = FirebaseDB;
