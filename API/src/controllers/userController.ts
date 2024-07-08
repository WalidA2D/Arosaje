import { Request, Response } from 'express';
import { userService } from '../services/userService';

const addUser = async (req: Request, res: Response) => {
  const { lastName, firstName, email, address, phone, cityName, password } = req.body;
  const result = await userService.addUser(lastName, firstName, email, address, phone, cityName, password);
  return res.status(result.status).json(result.body);
};

const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUser(parseInt(req.params.id));
  return res.status(user ? 200 : 404).json(user || { message: 'User not found' });
};

const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res.status(200).json(users);
};

const validateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userService.validateUser(email, password);
  return res.status(result.status).json(result.body);
};

const deleteUser = async (req: Request, res: Response) => {
  const result = await userService.deleteUser(parseInt(req.params.id));
  return res.status(result.status).json(result.body);
};

const updateUserToBotanist = async (req: Request, res: Response) => {
  const result = await userService.updateUserToBotanist(parseInt(req.params.id));
  return res.status(result.status).json(result.body);
};

export { addUser, getUser, getUsers, validateUser, deleteUser, updateUserToBotanist };
