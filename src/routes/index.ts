import { Router } from "express";
import bodyParser, { json } from 'body-parser'

import {
    getTodos,
    getTodo,
    addTodo,
    updateTodo,
    removeTodo,
} from "../controllers/todos"
// declare router
const router = Router()

// declare jsonParser
const jsonParser = bodyParser.json()

// Mendapatkan end point dengan metode get
router.get('/api/todos', getTodos)

// Mendapatkan 1 data todo dengan params id
router.get('/api/todo/:id', getTodo)

// Menambahkan data todo dengan metode post
router.post('/api/add-todo', jsonParser, addTodo)

// untuk fitur update metode put untuk completed or uncompleted dengan params id
router.put('/api/update-todo/:id', jsonParser, updateTodo)

// Menghapus id dengan metode delete dengan params id
router.delete('/api/remove-todo/:id', jsonParser, removeTodo)

export default router