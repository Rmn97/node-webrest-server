import { Request, Response } from "express";
import { todo } from "node:test";

const todos = [
    { id: 1, text: 'Got some soup?', createdAt: new Date() },
    { id: 2, text: 'Got some milk?', createdAt: null },
    { id: 3, text: 'Got some juice?', createdAt: new Date() },
]

export class TodosController {

    //* DI Dependency Injection
    constructor() { }

    public getTodos = (req: Request, res: Response) => {
        return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Id argument is not a number' })
        const todo = todos.find(todo => todo.id === id);

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });
    }

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        const newTodo = {
            id: todos.length + 1,
            text: text,
            createdAt: null
        }
        if (!text) res.status(400).json({ error: 'Text property is required' });

        todos.push(newTodo);

        res.json(newTodo);
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Id argument is not a number' });

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const { text, createdAt } = req.body;
        
        todo.text = text || todo.text;
        //! OJO, refencia
        ( createdAt === null)
            ? todo.createdAt = null
            : todo.createdAt = new Date(createdAt || todo.createdAt);

        res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const todo = todos.find(todo => todo.id === id);

        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        todos.splice(todos.indexOf(todo), 1);
        res.json(todo);


    }
}