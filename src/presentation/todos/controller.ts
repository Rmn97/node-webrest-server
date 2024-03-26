import { Request, Response } from "express";
import { todo } from "node:test";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";

// const todos = [
//     { id: 1, text: 'Got some soup?', createdAt: new Date() },
//     { id: 2, text: 'Got some milk?', createdAt: null },
//     { id: 3, text: 'Got some juice?', createdAt: new Date() },
// ]

export class TodosController {

    //* DI Dependency Injection
    constructor() { }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();

        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'Id argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        // const todo = todos.find(todo => todo.id === id);

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });
    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);
        if (error) return res.status(400).json({ error });


        const todo = await prisma.todo.create({
            data: createTodoDTO!
        });

        res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDTO.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });
        
        const todo = await prisma.todo.findFirst({
          where: { id }
        });
    
        if ( !todo ) return res.status( 404 ).json( { error: `Todo with id ${ id } not found` } );
    
        const updatedTodo = await prisma.todo.update({
          where: { id },
          data: updateTodoDto!.values
        });
      
        res.json( updatedTodo );
    }

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        // const todo = todos.find(todo => todo.id === id);
        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const deleted = await prisma.todo.delete({
            where: { id }
        });
        // todos.splice(todos.indexOf(todo), 1);

        (deleted)
            ? res.json(deleted)
            : res.status(400).json({ error: `Todo with id ${id} not found` });
        // res.json({ todo, deleted });


    }
}