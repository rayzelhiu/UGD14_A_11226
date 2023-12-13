import { useEffect, useState } from "react";
import { db, DB_TODO_KEY } from "../../firebaseConfig";
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { IoIosList } from "react-icons/io";
import "./TodoList.css";

export default function TodoList() {
            const [list, setList] = useState([]);
            const [user, setUser] = useState(null);
            const [editedItemId, setEditedItemId] = useState(null);
            const [editedItemValue, setEditedItemValue] = useState("");
            const navigate = useNavigate();

            useEffect(() => {
                const userLocalStorage = localStorage.getItem("userfb");
                if (!userLocalStorage) {
                navigate("/");
                } else {
                const userLocalStorageObject = JSON.parse(userLocalStorage);
                setUser(userLocalStorageObject);

                const dataRef = ref(db, DB_TODO_KEY);
                const onDataChange = (snapshot) => {
                    const newData = snapshot.val();
                    if (!Array.isArray(newData)) {
                    setList([]);
                    } else {
                    setList(newData);
                    }
                };
                onValue(dataRef, onDataChange);

                return () => {
                    off(dataRef, onDataChange);
                };
                }
            }, [navigate]);

            const addItem = () => {
                const newData = list || [];
                const isiTodo = prompt("Masukkan isi ToDo:");

                if (isiTodo && isiTodo.trim()) {
                const newItem = {
                    id: Date.now(),
                    todo: isiTodo,
                    user: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    },
                };

                newData.push(newItem);
                const dataRef = ref(db, DB_TODO_KEY);
                set(dataRef, newData);
                }
            };

            const deleteItem = (id) => {
                const newData = list || [];
                const index = newData.findIndex((item) => item.id === id);
                if (index !== -1) {
                newData.splice(index, 1);
                const dataRef = ref(db, DB_TODO_KEY);
                set(dataRef, newData);
                }
            };

            const updateItem = () => {
                if (editedItemId && editedItemValue.trim()) {
                const newData = list.map((item) =>
                    item.id === editedItemId
                    ? {
                        ...item,
                        todo: editedItemValue,
                        }
                    : item
                );
                const dataRef = ref(db, DB_TODO_KEY);
                set(dataRef, newData);
                setEditedItemId(null);
                setEditedItemValue("");
                }
            };

            const startEditing = (id, value) => {
                setEditedItemId(id);
                setEditedItemValue(value);
            };

                return (
                    <div>
                    <h1>Todo List </h1>
                    <ul className="todoList">
                        <IoIosList />
                        {list.length > 0 ? (
                        list.map((item) => (
                            <li key={item.id}>
                            <div className="todoList-user">
                                <img
                                src={item.user.photoURL}
                                alt={item.user.displayName}
                                className="todoList-user-img"
                                referrerPolicy="no-referrer"
                                />
                                <div className="todoList-user-field">
                                <p className="todoList-user-name">{item.user.displayName}</p>
                                <p className="todoList-user-email">{item.user.email}</p>
                                </div>
                                <div className="todoList-user-actions">
                                <button className="todoList-user-edit"  onClick={() => startEditing(item.id, item.todo)}>
                                    ✎
                                </button>
                                <button className="todoList-user-delete" onClick={() => deleteItem(item.id)} >
                                    ×
                                </button>
                                </div>
                            </div>
                            {editedItemId === item.id ? (
                                <input
                                type="text"
                                value={editedItemValue}
                                onChange={(e) => setEditedItemValue(e.target.value)}
                                required
                                />
                            ) : (
                                <p>{item.todo}</p>
                            )}
                            </li>
                        ))
                        ) : (
                        <p className="todoList-empty">Belum ada Todo</p>
                        )}
                    </ul>
                    <div className="todoList-actions">
                        <button onClick={addItem}>Add Item</button>
                        {editedItemId && (
                        <button onClick={updateItem} className="todoList-update">
                            Update Item
                        </button>
                        )}
                    </div>
                    </div>
            );
}
